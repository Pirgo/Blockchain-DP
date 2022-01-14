const { TypeEnum } = require("../transactions/transactionEnums");
const CertificateTransactionBuilder = require("../transactions/builders/certificateTransactionBuilder");
const PresenceTransactionBuilder = require("../transactions/builders/presenceTransactionBuilder");
const PartialGradeTransactionBuilder = require("../transactions/builders/partialGradeTransactionBuilder");
const FinalGradeTransactionBuilder = require("../transactions/builders/finalGradeTransactionBuilder");

//jak przekazemy nulla to zwraca wszystkie tranzakcje
class BlockchainIterator {
  constructor(blockchain, type) {
    this.blockchain = blockchain;
    this.start = 1;
    this.end = blockchain.chain.length;
    this.type = type;
  }

  createBuilder(type) {
    switch (type) {
      case TypeEnum.certificate:
        return new CertificateTransactionBuilder();
      case TypeEnum.presence:
        return new PresenceTransactionBuilder();
      case TypeEnum.partialGrade:
        return new PartialGradeTransactionBuilder();
      case TypeEnum.finalGrade:
        return new FinalGradeTransactionBuilder();
    }
  }

  [Symbol.iterator]() {
    let counter = 0;
    let i = 0;
    let nextTransaction;
    return {
      next: () => {
        while (this.start < this.end) {
          while (i < this.blockchain.chain[this.start].data.length) {
            const type = this.blockchain.chain[this.start].data[i].type;
            const builder = this.createBuilder(type);
            builder.buildFromJSON(this.blockchain.chain[this.start].data[i]);
            nextTransaction = builder.getResult();
            if (this.type === null) {
              counter++;
              i++;
              return { value: nextTransaction, done: false };
            } else if (
              this.blockchain.chain[this.start].data[i].type === this.type
            ) {
              counter++;
              i++;
              return { value: nextTransaction, done: false };
            }
            i++;
          }
          this.start++;
          i = 0;
        }
        return { value: counter, done: true };
      },
    };
  }
}

module.exports = BlockchainIterator;
