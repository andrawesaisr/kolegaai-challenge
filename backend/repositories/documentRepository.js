import Document from "../models/document.js";

export class DocumentRepository {
  async create(documentData) {
    return await Document.create(documentData);
  }

  async findAll() {
    const res = await Document.findAll({
      order: [["uploadDate", "DESC"]],
    });
    return res;
  }

  async findById(id) {
    return await Document.findByPk(id);
  }

  async delete(id) {
    return await Document.destroy({
      where: { id },
    });
  }
}

export default new DocumentRepository();
