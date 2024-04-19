// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpack = require('webpack');

module.exports = {
	entry: {
		background: './background.ts',
		content: './content.ts'
	},
	resolve: {
		extensions: ['.js', '.ts'],
		alias: {
			'@shared': path.resolve(__dirname, '../../shared')
		},
		fallback: {
			buffer: require.resolve('buffer/'),
			util: require.resolve('util/'),
			crypto: require.resolve('crypto-browserify'),
			stream: require.resolve('stream-browserify')
		}
	},
	output: {
		path: path.join(__dirname, '../build/scripts/'),
		filename: '[name].js'
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: {
					loader: 'ts-loader',
					options: {
						transpileOnly: true
					}
				},
				exclude: /node_modules/
			}
		]
	},
	plugins: [
		new webpack.ProvidePlugin({
			Buffer: ['buffer', 'Buffer']
		})
	],
	experiments: {
		syncWebAssembly: true
	}
};
