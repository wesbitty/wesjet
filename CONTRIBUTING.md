# <img src="https://i.ibb.co/dMH4HS8/wesjet.png" height="30" />&nbsp;&nbsp;wesjet [![](https://badgen.net/npm/v/wesjet)](https://www.npmjs.com/wesjet/packages)


Wesjet is developed as a monorepo using Yarn. 

### Contributing to Wesjet
 [![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-ready--to--code-908a85?logo=gitpod)](https://gitpod.io/#https://github.com/wesbitty/wesjet)


* **Cloning Wesjet Repo**

```sh
git clone --recurse-submodules git://github.com/wesbitty/wesjet.git
```

* **Update Git submodules**

```sh
git submodule update --init --recursive
```

* **installing Dependencies**

```sh
yarn install
```

* **One Time Build**

```sh
yarn wesjet:build

# Build and watch files for changes
# ... or run `dev:ts` VSC task via `Tasks: Run Task`
yarn dev:ts
```

* **Tests**

```sh
yarn test
```
