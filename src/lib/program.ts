import { Block } from "./blocks/block";
import { Connection } from "./blocks/connection";

export class Program {
  private currentBlockId = 1;

  public readonly blocks: Block[] = [];
  public readonly connections: Connection[] = [];

  public addBlock<T extends Block>(block: T): T {
    block.id = this.currentBlockId++;
    block.setProgram(this);

    this.blocks.push(block);

    return block;
  }

  public removeBlock(block: Block): boolean {
    const index = this.blocks.indexOf(block);

    if (index === -1) {
      return false;
    }

    this.blocks.splice(index, 1);

    for (const connection of this.connections) {
      if (connection.inputBlock === block || connection.outputBlock === block) {
        this.removeConnection(connection);
      }
    }

    return true;
  }

  /**
   * Adds a connection. If another connection already exists and the input accepts only one,
   * it will be removed and returned.
   */
  public addConnection(connection: Connection): Connection | undefined {
    this.validateConnection(connection);

    let existingConnection: Connection | undefined;

    if (!connection.outputBlock.inputTypes[connection.outputIndex].multiple) {
      existingConnection = this.getConnectionsByOutput(
        connection.outputBlock,
        connection.outputIndex
      )[0];

      if (existingConnection) {
        this.removeConnection(existingConnection);
      }
    }

    connection.program = this;

    this.connections.push(connection);

    return existingConnection;
  }

  public removeConnection(connection: Connection): boolean {
    const index = this.connections.indexOf(connection);

    if (index === -1) {
      return false;
    }

    this.connections.splice(index, 1);

    return true;
  }

  public getConnectionsByInput(block: Block, index: number): Connection[] {
    return this.connections.filter(
      (connection) =>
        connection.inputBlock === block && connection.inputIndex === index
    );
  }

  public getConnectionsByOutput(block: Block, index: number): Connection[] {
    return this.connections.filter(
      (connection) =>
        connection.outputBlock === block && connection.outputIndex === index
    );
  }

  private validateConnection(connection: Connection): void {
    if (
      connection.inputIndex < 0 ||
      connection.outputIndex < 0 ||
      connection.inputIndex >= connection.inputBlock.outputTypes.length ||
      connection.outputIndex >= connection.outputBlock.inputTypes.length
    ) {
      throw new Error(
        `Connection ${String(connection.inputBlock.id)}:${String(
          connection.inputIndex
        )} -> ${String(connection.outputBlock.id)}:${String(
          connection.outputIndex
        )} is invalid`
      );
    }

    const inputType =
      connection.inputBlock.outputTypes[connection.inputIndex].type;
    const outputType =
      connection.outputBlock.inputTypes[connection.outputIndex].type;

    if (!outputType.has(inputType)) {
      throw new Error(
        `Connection ${String(connection.inputBlock.id)}:${String(
          connection.inputIndex
        )} -> ${String(connection.outputBlock.id)}:${String(
          connection.outputIndex
        )} have different types`
      );
    }
  }
}
