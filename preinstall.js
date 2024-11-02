if (!/npm/.test(process.env.npm_execpath || '')) {
  console.warn('请使用npm作为包管理器！')
  // process.exit(1)
}