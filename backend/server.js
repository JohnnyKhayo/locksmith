
const express = require("express")
const cors = require("cors")

const app = express();
const PORT = 3001;

app.use(cors());

const lockProducts = [
  {
    id: 1,
    sku: "E-Z-0080-H1",
    name: "Complete Door Lock Modern Unique Hexagonal E-Z-0080-H1",
    series: "Wood",
    price: 10100,
    image: "images/smith.1.webp",
    stock: 8,
    featured: true,
    description: "Modern hexagonal handle lock for wooden doors"
  },
  {
    id: 2,
    sku: "E-Z-0078-S1",
    name: "Elegant Entry Door Lock | Simple & Secure - E-Z-0078-S1",
    series: "Wood",
    price: 10100,
    image: "images/smith.2.webp",
    stock: 6,
    featured: true,
    description: "Simple secure entry lock"
  },
  {
    id: 3,
    sku: "E-B-0004-R1",
    name: "Luxury Metal Door Lock Set with Grooved Jewelry Handle - E-B-0004-R1",
    series: "Metallic",
    price: 18000,
    image: "images/smith.3.webp",
    stock: 4,
    featured: true,
    description: "Luxury grooved metal handle set"
  },
  {
    id: 4,
    sku: "EZ-0020-R1",
    name: "Complete Door Lock Set Wooden Handle EZ-0020 R1",
    series: "Wood",
    price: 10100,
    image: "images/smith.4.webp",
    stock: 7,
    featured: true,
    description: "Complete set with wooden handle"
  },
  {
    id: 5,
    sku: "E-B-0005-S1",
    name: "Artistic Crystal Handle Lock set | Premium Design - E-B-0005-S1",
    series: "Grand",
    price: 18000,
    image: "images/smith.5.webp",
    stock: 3,
    featured: true,
    description: "Crystal handle premium set"
  },
  {
    id: 6,
    sku: "E-B-0006-S1",
    name: "Grooved Handle Artistic metal Door Lock | Luxury Finish - E-B-0006-S1",
    series: "Metallic",
    price: 18000,
    image: "images/smith.6.webp",
    stock: 5,
    featured: true,
    description: "Artistic metal lock, luxury finish"
  },
  {
    id: 7,
    sku: "E-Z-0036-R1",
    name: "Knurled Grip Metal Door Lock Set | Modern - E-Z-0036-R1",
    series: "Metallic",
    price: 10100,
    image: "images/smith.7.webp",
    stock: 9,
    featured: true,
    description: "Modern knurled metal grip"
  },
  {
    id: 8,
    sku: "E-Z-0072-S1",
    name: "Solid Wood Accent Door Lock | Modern Security - E-Z-0072-S1",
    series: "Wood",
    price: 10850,
    image: "images/smith.8.webp",
    stock: 4,
    featured: true,
    description: "Solid wood accent with modern security"
  },
  {
    id: 9,
    sku: "E-Z-0133-R1",
    name: "Premium wooden door lock set with minimalist design - E-Z-0133-R1",
    series: "Wood",
    price: 10200,
    image: "images/smith.9.webp",
    stock: 6,
    featured: true,
    description: "Minimalist wooden lock set"
  },
  {
    id: 10,
    sku: "E-Z-0079-R1",
    name: "Modern Door Locks Set With Wooden handle | E-Z-0079-R1",
    series: "Wood",
    price: 10600,
    image: "images/smith.10.webp",
    stock: 5,
    featured: false,
    description: "Wooden handle modern set"
  },
  {
    id: 11,
    sku: "E-Z-0087-S1",
    name: "Square Knurled Handle Door Lock set | Contemporary Style - E-Z-0087-S1",
    series: "Metallic",
    price: 10100,
    image: "images/smith.11.webp",
    stock: 8,
    featured: false,
    description: "Square knurled contemporary handle"
  },
  {
    id: 12,
    sku: "E-Z-0199-R1",
    name: "Elegant Walnut Wood Circular Lock Set for Doors | E-Z-0199-R1",
    series: "Villa",
    price: 11200,
    image: "images/smith.12.webp",
    stock: 3,
    featured: false,
    description: "Walnut circular villa lock"
  },
  {
    id: 13,
    sku: "E-Z-0089-R1",
    name: "Circular lock for door - Modern unique E-Z-0089-R1",
    series: "Grand",
    price: 11050,
    image: "images/smith.13.webp",
    stock: 4,
    featured: false,
    description: "Modern unique circular lock"
  },
  {
    id: 14,
    sku: "GA27",
    name: "Elegant Wood finish modern Lock set for Doors | Modern Security - GA27",
    series: "Wood",
    price: 11200,
    image: "images/smith.14.webp",
    stock: 7,
    featured: false,
    description: "Wood finish modern security set"
  },
  {
    id: 15,
    sku: "E-Z-0083-R1",
    name: "Premium Leather Accent Door Lock System - E-Z-0083-R1",
    series: "Leather",
    price: 11200,
    image: "images/smith.15.webp",
    stock: 5,
    featured: false,
    description: "Leather accent lock system"
  },
  {
    id: 16,
    sku: "TNC005",
    name: "Complete Door Lock Premium Wood Brass TNC005",
    series: "Villa",
    price: 18000,
    image: "images/smith.16.webp",
    stock: 2,
    featured: false,
    description: "Premium wood and brass complete lock"
  },
  {
    id: 17,
    sku: "E-Z-0045-B",
    name: "Leather Handle Luxury Door Lock | Secure & Stylish - E-Z-0045 B",
    series: "Leather",
    price: 11200,
    image: "images/smith.17.webp",
    stock: 0,
    featured: false,
    description: "Luxury leather handle. Sold out"
  }
];


app.get("/api/products", (req, res) => {
  res.json(lockProducts);
});


app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});