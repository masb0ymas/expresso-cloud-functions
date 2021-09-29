import ModuleAlias from 'module-alias'

ModuleAlias.addAliases({
  '@expresso': `${__dirname}/@expresso`,
  '@config': `${__dirname}/config`,
  '@controllers': `${__dirname}/controllers`,
  '@jobs': `${__dirname}/jobs`,
  '@middlewares': `${__dirname}/middlewares`,
  '@migration': `${__dirname}/migration`,
  '@models': `${__dirname}/models`,
  '@routes': `${__dirname}/routes`,
  '@seeds': `${__dirname}/seeds`,
})
