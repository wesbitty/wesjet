# <img src="https://i.ibb.co/dMH4HS8/wesjet.png" height="30" />&nbsp;&nbsp;WesjetPkg [![](https://badgen.net/npm/v/wesjet)](https://www.npmjs.com/wesjet/packages)


WesjetPkg is developed using Yarn.

### Contributing to WesjetPkg
 [![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-ready--to--code-908a85?logo=gitpod)](https://gitpod.io/#https://github.com/wesbitty/wesjetpkg)


* **Cloning WesjetPkg Repo**

```sh
git clone --recurse-submodules git://github.com/wesbitty/wesjetpkg.git
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
