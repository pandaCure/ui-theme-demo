const webpack = require("webpack");
const { cloneDeep } = require("lodash");
const fs = require("fs");
const path = require("path");
function hookNormalModuleLoader(compiler, pluginName, callback) {
  const hookHandler = (context, module) => {
    const { resource } = module;
    if (!resource) return;
    const i = resource.indexOf("?");
    callback(context, module, i < 0 ? resource : resource.substr(0, i));
  };
  const webpackImplementation = webpack;
  compiler.hooks.compilation.tap(pluginName, (compilation) => {
    webpackImplementation.NormalModule.getCompilationHooks(
      compilation
    ).loader.tap(pluginName, hookHandler);
  });
}
function getLoader(loaders, loaderName) {
  if (!Array.isArray(loaders) || !loaders.length) return;
  return loaders.find((item) => item.loader.indexOf(loaderName) > -1);
}
class ThemePlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    this.compiler = compiler;
    this.hookForGlobalStyle();
    this.hookForVariables();
    // this.hookForComponentStyle();
  }
  hookForGlobalStyle() {
    let source = fs.readFileSync(
      require.resolve(path.join(__dirname, "theme-less", "button.less"))
    ).toString();
    if (!source) return;

    source = `;\n@import '~${path.join(
      __dirname,
      "theme-less",
      "button.less"
    )}';`;

    const appendLoader = require.resolve("./loader.js");
    hookNormalModuleLoader(
      this.compiler,
      "a",
      (_loaderContext, module, resource) => {
        if (/but\.(less|css)/g.test(resource) && !getLoader(module.loaders, appendLoader)) {
        //   console.log(resource, source);

          const loaders = cloneDeep(module.loaders || []);
          loaders.push({
            loader: appendLoader,
            options: {
              additionContent: source,
            },
            ident: null,
            type: null,
          });
          module.loaders = loaders;
        }
      }
    );
  }
  hookForVariables() {
    hookNormalModuleLoader(
      this.compiler,
      "a",
      (_loaderContext, module, resource) => {
        if (/a\.less$/g.test(resource)) {
            console.log(resource)
          const loaders = cloneDeep(module.loaders);
          const lessLoader = getLoader(loaders, "less-loader");
          lessLoader.options = {
            ...lessLoader.options,
            lessOptions: {
              ...lessLoader.options.lessOptions,
              modifyVars: {
                ...lessLoader.options.lessOptions.modifyVars,
                "@a": "10px",
              },
            },
          };

          module.loaders = loaders;
        }
      }
    );
  }
}
module.exports = ThemePlugin;
