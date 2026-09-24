
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
    description: "This hexagonal handle is made for wooden doors that need a clear focal point. The grip feels firm, the latch is straightforward to live with, and it suits main rooms where guests actually see the door."
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
    description: "A simple secure entry set for homes and small offices. It is easy to operate every day, sits neatly on a standard leaf, and does not crowd the door with extra decoration."
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
    description: "A luxury metal set with a grooved jewellery handle for the front door. It is meant to look expensive in the entrance and still close with a solid, reliable feel."
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
    description: "A complete lock set with a wooden handle if you want warmth on the door without losing strength. It pairs well with timber frames common in Kenyan houses and offices."
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
    description: "An artistic crystal handle set for spaces that should feel finished. Use it on a lounge or hallway door where the hardware is part of the room, not hidden."
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
    description: "A grooved artistic metal lock with a luxury finish. It works on feature doors where you want metal to catch the light and the handle to feel substantial."
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
    description: "A modern knurled metal grip that is easy to hold. The texture helps in daily use and the look fits new builds and renovated interiors."
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
    description: "A solid wood accent lock for people who want security and timber in one piece. It reads as calm and strong rather than bulky on the door."
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
    description: "A  premium wooden set with a minimalist face. Good for bedrooms and inner doors where you want quiet hardware and a clean line."
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
    description: "A modern set with a wooden handle for everyday rooms. It is a practical match for interior wooden doors that need a lock that does not look temporary."
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
    description: "A square knurled handle in a contemporary style. Choose it when the house already has sharp furniture lines and you want the lock to follow that language."
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
    description: "An elegant walnut circular lock for villa style entrance doors. The round form and wood tone suit larger leaves and more formal hallways."
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
    description: "A modern circular lock when the door itself should feel designed. It stands out on the leaf and still does the basic job of locking the room."
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
    description: "An elegant wood finish set for daily security. Built for family and office doors that open many times a day and still need to look tidy."
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
    description: "A premium leather accent system for a softer grip and a tailored look. It suits dressed interiors where metal alone would feel too cold."
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
    description: "A  complete wood and brass lock for heavier doors. Brass lifts the finish and the full set is meant for a main entrance that should feel expensive."
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
    description: "A luxury leather handle for a stylish secure entrance. This item is sold out, so treat it as a reference until stock returns."
  }
];


app.get("/api/products", (req, res) => {
  res.json(lockProducts);
});


app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});