import fs from "fs/promises";
import { parse } from "./parsers";
import { Atom, StructureGuess } from "./atom";

export class File {
  constructor(
    private handle?: fs.FileHandle,
    private offset?: number,
    private limit?: number
  ) {}

  async open(filename: string) {
    this.handle = await fs.open(filename, "r");
    this.offset = 0;
    const stat = await this.handle.stat();
    this.limit = stat.size;
  }

  async close() {
    if (this.handle) {
      await this.handle.close();
    }
  }

  async readAtoms(parent?: Atom): Promise<Atom[] | undefined> {
    if (!this.handle || this.offset === undefined || this.limit === undefined) {
      return;
    }
    const atoms = [];
    let offset = this.offset;
    const buffer = Buffer.alloc(8);
    while (offset < this.limit) {
      await this.handle.read(buffer, 0, buffer.length, offset);
      let size: number = buffer.readUInt32BE();
      const type = buffer.toString("ascii", 4);
      const isLargeSize = size === 1;
      if (isLargeSize) {
        await this.handle.read(buffer, 0, buffer.length, offset + 8);
        const newSize = buffer.readBigInt64BE();
        if (newSize <= Number.MAX_SAFE_INTEGER) {
          size = Number(newSize);
        }
      }
      if (type.length === 4 && size >= 8 && size + offset <= this.limit) {
        atoms.push({
          offset,

          size,
          type,

          file: new File(
            this.handle,
            offset + (isLargeSize ? 8 + 8 : 8),
            offset + size
          ),
        });
        offset += size;
      } else if (offset === this.offset && parent) {
        // fullbox parent? try find
        parent.guess = StructureGuess.Fullbox;
        offset += 4;
      } else if (offset === this.offset + 4 && parent) {
        // fullbox parent with 16 bit entry count?
        parent.guess = StructureGuess.EntryCount16Bit;
        offset += 2;
      } else if (offset === this.offset + 6 && parent) {
        // fullbox parent with 32 bit entry count?
        parent.guess = StructureGuess.EntryCount32Bit;
        offset += 2;
      } else {
        break; // if it's already went wrong, do not try further
      }
    }
    return atoms;
  }

  async readAtomTree(parent?: Atom) {
    const atoms = await this.readAtoms(parent);
    if (!atoms) {
      return;
    }
    for (const a of atoms) {
      const content = await parse(a);
      if (content) {
        a.content = content;
      } else {
        const atoms = await a.file.readAtomTree(a);
        if (atoms && atoms.length) {
          a.atoms = atoms;
        } else {
          a.unparsed = true;
        }
      }
    }
    return atoms;
  }

  async readContent(offset?: number, length?: number) {
    if (!this.handle) {
      return;
    }
    if (offset !== undefined && length !== undefined) {
      const buffer = Buffer.alloc(length);
      this.handle.read(buffer, 0, buffer.length, offset);
      return buffer;
    }
    if (this.offset === undefined || this.limit === undefined) {
      return;
    }
    const buffer = Buffer.alloc(this.limit - this.offset);
    await this.handle.read(buffer, 0, buffer.length, this.offset);
    return buffer;
  }
}
