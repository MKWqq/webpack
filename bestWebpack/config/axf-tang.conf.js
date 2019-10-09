let env = process.env.RUN_ENV

const CONFIGS = {
	local: {
		// 日志输出方式【控制台、文件】
		log4jsOutType: 'console',
		// // redis IP地址
		// redis_ip: (env === 'production' ? 'r-bp183abcb22d5b44.redis.rds.aliyuncs.com' : '127.0.0.1'),
		// 是否使用模拟数据
		useMockData: false,
		// key for sign
		// pramary_key: (env !== 'production' ? 'F8A4B9AD42CA9E12A2AE3F9D6C4D8531' : 'XXXXXXXX'),
		pramary_key: 'axinfu',
		Authorization: 'Basic YXBwOmFwcA=='
		// key for X-api-key
		// X_api_key: (env !== 'production' ? '169ECC42F3A71C4E3A625495577B2693' : 'XXXXXXXX')
	},
	test: {
		// 日志输出方式【控制台、文件】
		log4jsOutType: 'file',
		// 是否使用模拟数据
		useMockData: false,
		// key for sign
		pramary_key: 'axinfu',
		Authorization: 'Basic YXBwOmFwcA=='
	},
	preview: {
		// 日志输出方式【控制台、文件】
		log4jsOutType: 'file',
		// 是否使用模拟数据
		useMockData: false,
		// key for sign
		pramary_key: 'F8A4B9AD42CA9E12A2AE3F9D6C4D8531',
		// key for X-api-key
		X_api_key: '169ECC42F3A71C4E3A625495577B2693'
	},
	online: {
		// 日志输出方式【控制台、文件】
		log4jsOutType: 'file',
		// 是否使用模拟数据
		useMockData: false,
		// key for sign
		pramary_key: 'F8A4B9AD42CA9E12A2AE3F9D6C4D8531',
		// key for X-api-key
		X_api_key: '169ECC42F3A71C4E3A625495577B2693'
	}
}

module.exports = CONFIGS[env] || CONFIGS['local']

