const cup = require('./baseCup');

const getChargeData = data => {
	if (!data) return false;
	let outOBJ = { head: { payMenPeo: data.kpy || '' }, chargeItems: [] },
		itemModle = {};

	if (data.zx_list && data.zx_list.length) {
		data.zx_list.map(el => {
			itemModle.chargeCode = cup[el.zx_mc] || "01";
			itemModle.amt = el.je;
			outOBJ.chargeItems.push(itemModle);
		});
	}
	return outOBJ;
};

export { getChargeData };