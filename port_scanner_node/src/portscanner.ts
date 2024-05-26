#!/usr/bin/env node

import * as net from 'net';

async function isPortOpen(host: string, port: number): Promise<boolean> {
  console.log('scanning: ', port, ' at ', host);
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(1000); // 1 second timeout

    socket.on('connect', () => {
      console.log('hit');
      socket.destroy();
      resolve(true);
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });

    socket.on('error', () => {
      resolve(false);
    });

    socket.connect(port, host);
  });
}

async function getAccessiblePorts(address: string, minPort: number, maxPort: number): Promise<number[]> {
  const foundPorts: number[] = [];

  for (let port = minPort; port <= maxPort; port++) {
    if (await isPortOpen(address, port)) {
      foundPorts.push(port);
    }
  }

  return foundPorts;
}

async function main() {
  const [address, minPort, maxPort] = process.argv.slice(2);

  if (!address || !minPort || !maxPort) {
    console.log('usage: node portScanner.js address min_port max_port');
    process.exit(1);
  }

  const ports = await getAccessiblePorts(address, parseInt(minPort), parseInt(maxPort));

  if (ports.length < 1) {
    console.log('no ports open in range ', minPort, '-', maxPort);
  } else {
    console.log('ports: ');
    ports.forEach(port => console.log(port));
  }

}

if (require.main === module) {
  main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
}