module.exports = {
    plugins: [
      require('@fullhuman/postcss-purgecss')({
        content: [
          './src/**/*.html',
          './src/**/*.ts',
          './src/**/*.scss'
        ],
        defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
        safelist: [/^mat-/, /^cdk-/, /^ng-/] // Para Angular Material
      })
    ]
  }