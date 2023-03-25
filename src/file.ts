import fs from "fs/promises";
import { parse } from "./parsers";
import { Atom } from "./atom";

export class File {
  private header: Buffer;

  constructor(
    private handle?: fs.FileHandle,
    private offset?: number,
    private limit?: number
  ) {
    this.handle = handle;
    this.offset = offset;
    this.limit = limit;
    this.header = Buffer.alloc(8);
  }

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

  async readAtoms(): Promise<Atom[] | undefined> {
    if (!this.handle || this.offset === undefined || this.limit === undefined) {
      return;
    }
    const atoms = [];
    let offset = this.offset;
    while (offset < this.limit) {
      await this.handle.read(this.header, 0, this.header.length, offset);
      const size = this.header.readUint32BE();
      const type = this.header.toString("ascii", 4);
      if (size >= 8 && size + offset <= this.limit) {
        atoms.push({
          type,
          file: new File(this.handle, offset + 8, offset + size),
        });
        offset += size;
      } else {
        break;
      }
    }
    return atoms;
  }

  async readAtomTree() {
    const atoms = await this.readAtoms();
    if (!atoms) {
      return;
    }
    for (const a of atoms) {
      const content = await parse(a);
      if (content) {
        a.content = content;
      } else {
        const atoms = await a.file.readAtomTree();
        if (atoms && atoms.length) {
          a.atoms = atoms;
        } else {
          a.unparsed = true;
        }
      }
    }
    return atoms;
  }

  async readContent() {
    if (!this.handle || this.offset === undefined || this.limit === undefined) {
      return;
    }
    const buffer = Buffer.alloc(this.limit - this.offset);
    await this.handle.read(buffer, 0, buffer.length, this.offset);
    return buffer;
  }
}
