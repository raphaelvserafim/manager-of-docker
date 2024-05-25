import { Docker } from 'node-docker-api';
import tcpPortUsed from 'tcp-port-used';
import { envs } from '../configs/env';
import { createFile, removeFile } from './nginx';

const dc = new Docker({ socketPath: envs.socketPath });
const image = envs.imageName;
export default class Manager {

  static async run(key: string) {
    try {
      const memoria = 1048576 * 100;
      let port = Math.floor(Math.random() * 1000) + 3000;
      let increment_port = port.toString().length === 1 ? '400' : (port.toString().length === 2 ? '40' : (port.toString().length === 3 ? '4' : ''));
      while (await tcpPortUsed.check(port, '127.0.0.1')) {
        port = Math.floor(Math.random() * 1000) + 3000;
        increment_port = port.toString().length === 1 ? '400' : (port.toString().length === 2 ? '40' : (port.toString().length === 3 ? '4' : ''));
      }
      const containerConfig = {
        Image: image,
        name: key,
        Env: [`KEY=${key}`, `EXAMPLE_NUMBER="556696852025"`],
        ExposedPorts: {
          "3001/tcp": {}
        },
        HostConfig: {
          Memory: memoria,
          MemorySwap: memoria * 2,
          MemorySwappiness: 100,
          RestartPolicy: { Name: "always", MaximumRetryCount: 0 },
          PortBindings: {
            "3001/tcp": [{
              "HostPort": increment_port + port
            }]
          },
          Binds: [
            "/home/wa:/home/wa",
            `/home/wa/sessions/${key}:/home/wa/sessions`
          ],
          PublishAllPorts: true
        }
      };
      const container = await dc.container.create(containerConfig);
      await container.start();
      createFile(key, increment_port + port.toString());
      return { status: 200 };
    } catch (error: any) {
      return { status: 500, message: error?.message };
    }
  }

  static async getContainers() {
    try {
      const containers = await dc.container.list({ all: true });
      return containers;
    } catch (error) {
      throw error;
    }
  }

  static async getContainerByName(name: string) {
    try {
      const containers = await this.getContainers();
      return containers.find((container: any) => {
        return container.data?.Names[0].replace('/', '') === name;
      });
    } catch (error) {
      throw error;
    }
  }

  static async startContainer(container: any) {
    try {
      return await container.start();
    } catch (error) {
      throw error;
    }
  }

  static async stopContainer(container: any) {
    try {
      return await container.stop();
    } catch (error) {
      throw error;
    }
  }

  static async deleteContainer(container: any) {
    try {
      await this.stopContainer(container).then(container => container.delete({ v: true }));
    } catch (error) {
      throw error;
    }
  }

  static async startContainerByName(key: string) {
    try {
      const containers = await this.getContainerByName(key);
      if (!containers) {
        return { status: 404, message: "Container not found" };
      }
      await this.startContainer(containers);
      return { status: 200 };
    } catch (error: any) {
      return { status: 500, message: error.message };
    }
  }

  static async stopContainerByName(key: string) {
    try {
      const containers = await this.getContainerByName(key);
      if (!containers) {
        return { status: 404, message: "Container not found" };
      }
      await this.stopContainer(containers);
      return { status: 200 };
    } catch (error: any) {
      return { status: 500, message: error.message };
    }
  }

  static async deleteContainerByName(key: string) {
    try {
      const containers = await this.getContainerByName(key);
      if (!containers) {
        return { status: 404, message: "Container not found" };
      }
      await this.deleteContainer(containers);
      removeFile(key)
      return { status: 200 };
    } catch (error: any) {
      return { status: 500, message: error.message };
    }
  }

  static async listContainers() {
    try {
      const containers = await this.getContainers();
      const containersData = containers.map((container: any) => ({
        id: container.data.Id,
        name: container.data.Names[0]?.replace('/', ''),
        image: container.data.Image,
        state: container.data.State,
        status: container.data.Status
      }));
      return { status: 200, total: containersData.length, containers: containersData };
    } catch (error: any) {
      return { status: 500, message: error.message };
    }
  }
}
