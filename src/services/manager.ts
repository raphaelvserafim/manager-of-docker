import { Docker } from 'node-docker-api';
import tcpPortUsed from 'tcp-port-used';
import { envs } from '../configs/env';
import { createFile, removeFile } from './nginx';

const dc = new Docker({ socketPath: envs.socketPath });
const image = envs.imageName;
export default class Manager {

  static async run(key: string) {
    try {
      const memoria = 512 * 1048576;
      let port = Math.floor(Math.random() * 10000) + 3000;
      let increment_port = port.toString().length === 1 ? '400' : (port.toString().length === 2 ? '40' : (port.toString().length === 3 ? '4' : ''));
      while (await tcpPortUsed.check(port, '127.0.0.1')) {
        port = Math.floor(Math.random() * 10000) + 3000;
        increment_port = port.toString().length === 1 ? '400' : (port.toString().length === 2 ? '40' : (port.toString().length === 3 ? '4' : ''));
      }
      const containerConfig = {
        Image: image,
        name: key,
        Env: [`KEY=${key}`],
        ExposedPorts: {
          "3001/tcp": {}
        },
        HostConfig: {
          Memory: memoria,
          MemorySwap: memoria * 2,
          MemorySwappiness: 60,
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

  static async info(name: string) {
    try {
      const container = await this.getContainerByName(name);
      if (!container) {
        throw new Error('Container not found');
      }
      const logs = await container.logs();
       
      return { status: 200, container: { id: container?.id, logs: logs.toString() } };
    } catch (error: any) {
      return { status: 500, message: error.message };
    }
  }

  static async restartContainer(id: string) {
    try {
      const container = dc.container.get(id);
      if (!container) {
        return { status: 404, message: "Container not found" };
      }
      await container.restart();
      return { status: 200 };
    } catch (error: any) {
      return { status: 500, message: error.message };
    }
  }


  static async startContainer(id: string) {
    try {
      const container = dc.container.get(id);
      if (!container) {
        return { status: 404, message: "Container not found" };
      }
      await container.start();
      return { status: 200 };
    } catch (error: any) {
      return { status: 500, message: error.message };
    }
  }

  static async stopContainer(id: string) {
    try {
      const container = dc.container.get(id);
      if (!container) {
        return { status: 404, message: "Container not found" };
      }
      await container.stop();
      return { status: 200 };
    } catch (error: any) {
      return { status: 500, message: error.message };
    }
  }

  static async deleteContainer(id: string) {
    try {
      const container = dc.container.get(id);
      if (!container) {
        return { status: 404, message: "Container not found" };
      }
      await container.delete({ v: true });
      removeFile(id);
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
