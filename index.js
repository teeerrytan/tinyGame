const app = require("express")();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);

let connectedUsers = [];
let userCards = new Map();
let rank = [];
let userStatus = new Map();

const cards = [
	"提高数学",
	"有三五知己",
	"社团活动",
	"目标清晰",
	"责任",
	"生命在于静止",
	"锻炼口语",
	"男女通吃",
	"志愿者",
	"渴望自由",
	"诚信",
	"有氧运动",
	"奥赛",
	"创造",
	"阅读",
	"颓废",
	"礼貌",
	"灌篮高手",
	"满腹经纶",
	"学校“红人”",
	"书法",
	"有理想",
	"友善",
	"乒乓小将",
	"思维敏捷",
	"教师好帮手",
	"乐器",
	"奋斗",
	"感恩",
	"足球小子",
	"胜利",
	"活雷锋",
	"压力",
	"坚持",
	"坚强",
	"正能量",
	"荣誉",
	"“交际花”",
	"遗憾",
	"努力",
	"信用",
	"街舞达人",
	"学富五车",
	"存在感",
	"我是歌手",
	"差不多就行",
	"勤勉",
	"开朗",
	"辩论队",
	"友谊",
	"演员",
	"迷茫",
	"专注",
	"健谈",
	"好文笔",
	"亲情",
	"庸碌",
	"收获爱情",
	"走心",
	"生命力",
	"主持",
	"尊师重道",
	"忙碌",
	"内向",
	"敏感",
	"焦虑",
	"领导力",
	"名声",
	"抱怨",
	"内心平静",
	"脆弱",
	"自卑",
	"口才",
	"沉默",
	"无聊",
	"无欲无求",
	"深刻",
	"嫉妒",
	"单科王",
	"被尊重",
	"乐趣",
	"佛系",
	"肤浅",
	"健康",
	"学霸",
	"安全感",
	"理性",
	"一帆风顺",
	"浮夸",
	"乐观",
	"按部就班",
	"隐私",
	"酷炫",
	"泪水",
	"奉献",
	"幽默",
	"享受",
	"冒险",
	"顺其自然",
	"阅历",
	"积极",
	"健身",
	"热爱生活",
	"保守",
	"艺术",
	"经验",
	"懒惰",
	"完美主义",
	"有情趣",
	"勇敢",
	"写作",
	"自知",
	"被动",
	"轰轰烈烈",
	"小确幸",
	"被接纳",
	"爱",
	"幸福",
	"革新",
	"强势",
	"平等",
	"独处",
	"哲学",
	"充实",
	"进取",
	"面具",
	"好习惯",
	"觉悟",
	"思想",
	"空虚",
	"耐心",
	"名列前茅",
	"挫折",
	"安静",
	"伪装",
	"满足",
	"认真",
	"纠结",
	"考上理想大学",
	"志愿者",
	"权利",
	"美/帅",
	"敷衍",
	"自律",
	"软弱",
	"卓越",
	"能力",
	"改头换面",
	"潦草",
	"超强行动力",
	"平平淡淡",
	"浑浑噩噩",
	"进步",
	"信仰",
	"真实",
	"同理",
	"心",
	"伟大",
	"力不从心",
	"成功",
	"独立自主",
	"智慧",
	"野心",
	"渺小",
	"做别人家的孩子",
	"精致",
	"逃避",
	"自私",
	"清醒",
	"麻痹",
	"竞争",
	"比较",
	"拖延",
	"后悔",
	"依赖",
	"愤怒",
	"人间不值得",
	"失败",
	"执着",
	"感性",
	"熬夜",
	"游戏",
	"手机",
	"聚会",
	"解锁新技能",
	"影响力",
	"兴趣",
	"珍惜时间",
	"音乐",
	"归属感",
	"痴迷",
	"有条不紊",
	"活力"
];

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

const port = process.env.PORT || 5000;

server.listen(port);

//socket.io connect
io.on("connection", socket => {
	updateUserName();
	updateRank();

	let userName = "";
	let oppoUser = "";
	//login
	socket.on("login", (name, callback) => {
		if (name.trim().length === 0) {
			return;
		}
		if (userCards.has(name)) {
			io.emit("err", name);
			return;
		}

		callback(true);
		userName = name;
		connectedUsers.push(userName);
		const shuffled = cards.sort(() => 0.5 - Math.random());
		let selected = shuffled.slice(0, 3);
		userCards.set(userName, selected);
		userStatus.set(userName, 1);
		for (let item of selected) {
			let j = 0;
			for (var i = 0, len = rank.length; i < len; i++) {
				if (rank[i][0] === item) {
					j = 1;
					break;
				}
			}
			if (j === 0) {
				rank.push([item, 0]);
			}
		}

		updateUserName();
	});

	socket.on("exchange", values => {
		currentOppo = values.currentOppo;
		oppoUser = currentOppo;
		yourValue = values.yourValue;
		currentUser = values.currentUser;
		myValue = values.myValue;

		for (var i = 0, len = rank.length; i < len; i++) {
			if (rank[i][0] === yourValue) {
				rank[i][1]++;
				break;
			}
		}
		if (!userCards.get(currentOppo)) {
			let yourList = Object.values(userCards.get(currentOppo));
			let myList = Object.values(userCards.get(currentUser));
			yourList.splice(yourList.indexOf(yourValue), 1, myValue);
			myList.splice(myList.indexOf(myValue), 1, yourValue);

			userCards.set(currentOppo, yourList);
			userCards.set(currentUser, myList);
			updateUserName();
			updateRank();
		} else {
			io.emit("oppoExit", {
				oppo: currentOppo
			});
		}
	});

	socket.on("changeStatus", data => {
		if (userStatus.get(`${data.user}`) === 1) {
			userStatus.set(`${data.user}`, 0);
		} else {
			userStatus.set(`${data.user}`, 1);
		}
		if (userStatus.get(`${data.currentUser}`) === 1) {
			userStatus.set(`${data.currentUser}`, 0);
		} else {
			userStatus.set(`${data.currentUser}`, 1);
		}
		updateUserName();
	});

	socket.on("disconnect", () => {
		if (connectedUsers.indexOf(userName) === -1) {
			void 0;
		} else {
			connectedUsers.splice(connectedUsers.indexOf(userName), 1);
		}
		userCards.delete(userName);
		userStatus.delete(userName);
		userStatus.set(oppoUser, 1);
		updateUserName();
		io.emit("oppoExit", {
			oppo: userName
		});
	});

	function updateUserName() {
		let data = [connectedUsers, userCards, userStatus];

		let userCardsArray = JSON.stringify(Array.from(userCards));
		let userStatusArray = JSON.stringify(Array.from(userStatus));

		io.emit("loadUser", {
			users: connectedUsers,
			userCards: userCardsArray,
			userStatus: userStatusArray
		});
	}

	async function updateRank() {
		rank = rank.sort(function(a, b) {
			return b[1] - a[1];
		});
		let rankArray = JSON.stringify(Array.from(rank));
		io.emit("updateRank", {
			rankArray: rankArray
		});
	}
});
