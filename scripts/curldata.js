const fs = require('fs');
require('dotenv').config();

async function getData() {
  try {
    const response = await fetch("https://api.football-data.org/v4/competitions/BL1/standings", {
                    headers: { "X-Auth-Token": `${process.env.FOOTBALL_API_KEY}` }});
    if (!response.ok) {
      throw new Error("HTTP error " + response.status);
    }
    const data = await response.json();
    await fs.writeFileSync('data.json', JSON.stringify(data, null, 2), 'utf8');
    console.log(data);
  } catch (error) {
    console.error("Something went wrong:", error);
  }
}

getData();