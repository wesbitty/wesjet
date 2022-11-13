#!/bin/bash

if ! command -v npx
then
    echo "npx is required to be installed for this script"
    exit
fi

echo "Creating a new project using create-wesjet-starter"
npx create-wesjet-starter wesjet-starter
cd wesjet-starter

npm add -D tailwindcss postcss autoprefixer date-fns wesjet wesjet-nextjs-plugin
echo "Added tailwindcss, postcss and autoprefixer as a devDependency"
npx tailwindcss init -p

echo "Configuring valid files glob for tailwindcss.config.js"
cat <<EOT > tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOT

echo "Configuring src/index.css"
cat <<EOT > src/index.css
@tailwind base;
@tailwind components;
@tailwind utilities;
EOT