/**
 * 通过json生成api接口 
 * @date 2022-03-16
 */
class GenApi {
  /**
   *  构造方法
   * @date 2022-03-16
   */
  constructor() {
    this.url =``
    this.config = {}
  }

  init() {
    return new Promise((resolve, reject) => {
      const http = require('https')
      const url = this.url
      http.get(url, function(res) {
        var body = '';
        res.on('data', function(chunk) {
          body += chunk;
        });
        res.on('end', function() {
          var fbResponse = JSON.parse(body);
          resolve(fbResponse)
        });
      }).on('error', function(e) {
        console.log("Got an error: ", e);
      });
    })
  }
  /**
   * 获取想要的生成信息 
   * @date 2022-03-16
   * @return {any}
   */
  getModList() {
    const list = []
    this.config.forEach((p) => {
      let className = ''
      if (p.list.length > 0) {
        const path = p.list[0].path
        const pathList = path.split('/')
        className = pathList[1]
      }
      const entity = { name: p.name, className }
      const apiList = p.list.map((api) => {
        const queryList = api.req_query.map((query) => {
          return { required: query.required, name: query.name, desc: query.desc || p.name }
        })
        const bodyForm = api.req_body_form.map((body) => {
          return { required: body.required, name: body.name, desc: body.desc || p.name }
        })
        return { method: api.method, path: api.path, title: api.title, desc: api.desc, queryList: queryList, bodyForm: bodyForm }
      })
      // 如果有相同的className 合并
      const oldEntity = list.find(p => p.className === entity.className)
      if (oldEntity) {
        oldEntity.apiList = [...oldEntity.apiList, ...apiList]
      } else {
        // 添加新的
        entity.apiList = apiList
        list.push(entity)
      }
    })
    const newList = []
    return list
  }

  /**
   * 生成内容
   * @date 2022-03-16
   */
  genContent() {
    const entityList = this.getModList()
    const fs = require('fs')
    const genContentList = []
    let importFunc = `import httpService from '@/util/httpService'\n`
    importFunc += `import SingleClass from '@/util/singleClass'\n`
    importFunc += `import { UseCommon } from '@/util/useCommon'\n`
    const newClass = []
    // 遍历所有的实体
    entityList.forEach((entity) => {
      // 内容
      const classContents = []
      // 遍历实体里的接口
      entity.apiList.forEach((api) => {
        // 获取方法名
        const methodName = this.getMethodName(api)
        // 获取参数
        const params = this.getParams(api)
        // 默认的site_id, lagnuage参数
        let defaultData = ''
        if (params.includes('site_id')) {
          defaultData = `\tif (!params.site_id) {\n`
          defaultData += `\t\t\tparams.site_id = UseCommon.ins().siteId\n\t\t}\n`
        }
        if (params.includes('language')) {
          defaultData += `\t\tif (!params.language) {\n`
          defaultData += `\t\t\tparams.language = UseCommon.ins().language\n\t\t}\n`
        }
        // 公共的httpService方法
        const returnData = `${defaultData}return httpService<T>({ url: '${api.path}', method: '${api.method}', params, showError })`
        // 设置注释
        const date = new Date().toLocaleDateString()
        const mockParams = `\t* @param {boolean} showError\n`
        const desc = `/**\n\t* ${api.title}\n\t* @date ${date}\n\t* @param {any} params\n${mockParams}\t* @return {any}\n\t*/`
        classContents.push(`${desc}\n\t${methodName}<T>(${params}, showError = true) {\n\t ${returnData}\n\t}`)
      })
      // 类名
      const className = this.titleCase(entity.className)
      const apiName = `${className}`
      // 类实例名
      const apiLower = this.titleLower(`${apiName}`)
      newClass.push(`${apiLower} : ${apiName}.ins()`)
      // 类的注释
      const date2 = new Date().toLocaleDateString()
      const classStr = `\n/**\n* ${entity.name}\n* @date ${date2}\n*/\n`
      // 单例
      let singleClass = `/**\n * 构造方法\n * @return {any}\n */\n`
      singleClass += `static ins(): ${className} {\n return super.ins() as ${className}\n }`
      // 类统一导出
      const classExtends = `${classStr}class ${apiName} extends SingleClass\t`
      const classEnity = `${classExtends}{\n\t${singleClass}\n\t${classContents.join('\t\n')}\n}\n`
      genContentList.push(classEnity)
    })
    const newClassStr = `\nexport const API = {\n\t${newClass.join(',\n\t')}\n}\n`
    const genContent = `${importFunc}${genContentList.join('\n')}${newClassStr}`
    fs.writeFileSync(`./src/api/apis.ts`, genContent)
  }

  /**
   * 获取方法名
   * @date 2022-03-21
   * @param {any} api
   * @returns {any}
  */
  getMethodName(api) {
    const paths = api.path.split('/')
    // api路径来决定方法名method='get'|'post'开头
    const method = api.method.toLocaleLowerCase()
    for (let index = 0; index < paths.length; index++) {
      if (index === 0) paths[index] = method
      else {
        paths[index] = paths[index].replace('_', '')
        paths[index] = this.titleCase(paths[index])
      }
    }
    const methodName = paths.join('')
    return methodName
  }

  /**
   * 获取方法参数
   * @date 2022-03-21
   * @param {any} api
   * @returns {any}
   */
  getParams(api) {
    const querys = []
    api.queryList.forEach((query) => {
      querys.push(this.setParams(query))
    })
    const bodyForm = []
    api.bodyForm.forEach((body) => {
      bodyForm.push(this.setParams(body))
    })
    let params = ''
    if (api.method === 'GET') params = `params: {${querys.join(',')}}`
    else if (api.method === 'POST') params = `params: {${bodyForm.join(',')}}`
    return params
  }

  /**
   * 设置参数默认值
   * @param {*} info 
   * @returns 
   */
  setParams(info) {
    return `${info.name}?: any`
  }

  /**
   * 首字母大写
   * @date 2022-03-16
   * @param {any} str
   * @return {any}
   */
  titleCase(str) {
    if (!str) return
    str = str.replace('_', '')
    const newStr = str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase()
    return newStr
  }

  /**
   * 首字母小写
   * @date 2022-03-16
   * @param {any} str
   * @return {any}
  */
  titleLower(str) {
    if (!str) return
    str = str.replace('_', '')
    const newStr = str.slice(0, 1).toLowerCase() + str.slice(1)
    return newStr
  }
}

(async () => {
  const genApi = new GenApi()
  genApi.config = await genApi.init()
  genApi.genContent()
})();
