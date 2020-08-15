const path = require('path');

const nodeExternals = require('webpack-node-externals');

module.exports = {
	mode: 'none', // i.e. not production or development (see: https://webpack.js.org/configuration/mode).
	target: 'node',
	node: {
		__dirname: false
	},
	externals: [nodeExternals()],
	entry: {
		app: './src/app.js',
		setup: './src/setup.js'
	},
	output: {
		path: path.join(__dirname, 'built'),
		filename: '[name].js'
	},
	devtool: 'inline-source-map',
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: [/node_modules/],
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							[
								'@babel/preset-env',
								{
									targets: {
										node: '14'
									}
								}
							]
						]
					}
				}
			}
		]
	},
	resolve: {
		extensions: ['.js'],
		modules: ['node_modules'],
		descriptionFiles: ['package.json']
	}
};
