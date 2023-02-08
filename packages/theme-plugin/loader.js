const appendLoader = function (source) {
  const options = this.getOptions();
  console.log(options);

  const additionContent = `${options.additionContent}`;
  if (!additionContent) return source;
  return `
  ${source}\n
  ${additionContent}\n
`;
};
module.exports = appendLoader;
module.exports.default = appendLoader;
