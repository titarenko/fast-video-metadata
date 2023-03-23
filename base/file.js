const fs = require("fs/promises");

class AtomContainer {
  constructor(handle, offset, limit) {
    this.handle = handle;
    this.offset = offset;
    this.limit = limit;
    this.header = Buffer.alloc(8);
  }
  async open(filename) {
    this.handle = await fs.open(filename, "r");
    this.offset = 0;
    const stat = await this.handle.stat();
    this.limit = stat.size;
  }
  async close() {
    await this.handle.close();
  }
  async readAtoms() {
    const atoms = [];
    let offset = this.offset;
    while (offset < this.limit) {
      await this.handle.read(this.header, 0, this.header.length, offset);
      const size = this.header.readUint32BE();
      const type = this.header.toString("ascii", 4);
      if (size >= 8 && size + offset <= this.limit) {
        atoms.push({
          type,
          file: new AtomContainer(this.handle, offset + 8, offset + size),
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
    for (const a of atoms) {
      a.atoms = await a.file.readAtomTree();
    }
    return atoms;
  }
}

module.exports = AtomContainer;
