((c) => {
  return (new Promise((modelReturn, modelError) => {
    const modelData = {};
    modelData.pageMainJsPath = c.pathName;
    modelData.pageMainJsName = (c.file.match(/^((?!\.\w+$).)*/) || [])[0];
    modelReturn(modelData);
  }))
});
