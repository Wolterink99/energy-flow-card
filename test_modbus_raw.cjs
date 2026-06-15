const net = require('net');

const client = new net.Socket();
const host = '192.168.178.130';
const port = 502;

console.log(`Connecting to ${host}:${port}...`);

client.setTimeout(3000);

client.connect(port, host, () => {
  console.log('Connected successfully!');
  
  // Construct a simple Modbus TCP read holding registers request (Slave 1, Address 49, quantity 1)
  // MBAP Header:
  // Transaction ID: 0x0001 (2 bytes)
  // Protocol ID: 0x0000 (2 bytes)
  // Length: 0x0006 (2 bytes)
  // Unit ID: 0x01 (1 byte)
  // PDU:
  // Function code: 0x03 (1 byte, Read Holding Registers)
  // Starting Address: 0x0031 (2 bytes, 49)
  // Quantity of Registers: 0x0001 (2 bytes)
  const packet = Buffer.from([
    0x00, 0x01, // Transaction ID
    0x00, 0x00, // Protocol ID
    0x00, 0x06, // Length
    0x01,       // Unit ID (Slave 1)
    0x03,       // Function code (Read Holding)
    0x00, 0x31, // Starting Address (49)
    0x00, 0x01  // Quantity (1)
  ]);
  
  console.log('Sending Modbus TCP packet:', packet.toString('hex'));
  client.write(packet);
});

client.on('data', (data) => {
  console.log('Received response (hex):', data.toString('hex'));
  client.destroy();
});

client.on('timeout', () => {
  console.log('Connection timed out waiting for response.');
  client.destroy();
});

client.on('error', (err) => {
  console.error('Connection error:', err.message);
});

client.on('close', () => {
  console.log('Connection closed');
});
