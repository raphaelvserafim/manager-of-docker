import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';

async function nginxReload(): Promise<boolean> {
	exec('service nginx restart', (error, stdout, stderr) => {
		if (error) {
			console.log(`error: ${error.message}`);
			return false;
		}
		if (stderr) {
			console.log(`stderr: ${stderr}`);
			return false;
		}
		return true;
	});
	return true;
}

export async function createFile(name: string, port: string): Promise<boolean> {
	const content = `
							location /${name}/ {
									rewrite /${name}/(.*)$ /$1 break;
									proxy_set_header X-Real-IP $remote_addr;
									proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
									proxy_set_header Host $http_host;
									proxy_set_header X-NginX-Proxy true;
									proxy_set_header X-Ssl on;
									proxy_pass http://127.0.0.1:${port};
									proxy_redirect off;
							}
					`;
	const filePath = path.join('/etc/nginx/proxy', `${name}.conf`);
	try {
		await fs.writeFile(filePath, content);
		nginxReload();
		return true;
	} catch (error) {
		console.error('Error creating file:', error);
		return false;
	}
}

export async function removeFile(name: string): Promise<boolean> {
	try {
		const filePath = path.join('/etc/nginx/proxy', `${name}.conf`);
		await fs.unlink(filePath);
		nginxReload();
		return true;
	} catch (error) {
		console.error('Error removing file:', error);
		return false;
	}
}
