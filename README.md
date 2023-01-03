1.VSCode 需安装 TSLint、stylelint 插件

2.git commit message 规范(详见 commitlint.config.js)：

- feat: 新功能（feature）
- update: 更新某功能
- fix: 修复 bug
- docs: 仅文档新增/改动
- style: 仅改动格式（不影响代码运行的变动）
- refactor: 重构某个功能
- revert: 回滚到上一版本
- build: 构建过程或辅助工具的变动
- test: 增加测试
- perf: 优化构建工具或运行时性能
- ci: 与 CI（持续集成服务）有关的改动
- chore: 其他改动

> 示例如下:
>
> - feat: 日志管理模块
> - build(package.json): 增加 husky 包
> - refactor: 日志管理\*\*\*
> - fix(#1): 修复\*\*\*问题
> - docs: 更新项目版本日志
> - style(文件名或模块): 修改文件缩进

另外，git push 会触发 husky 钩子，如果提交信息不规范则提交失败；如果 stylelint 或 tslint 有不规范的也会提交失败
