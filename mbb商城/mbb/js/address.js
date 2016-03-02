function saveAddress() {
	if (!Check_Consignee()) {
		return false
	}
	var b = document.getElementById("AddressID").value;
	var e = mui.constMap.ROOT_PATH + "/address/" + (b ? "update" : "add"),
		i = {};
	var g = document.getElementById("Name"),
		f = document.getElementById("Moblie"),
		c = document.getElementById("AddressInfo"),
		d = document.getElementById("seleAreaFouth"),
		h = document.getElementById("seleAreaNext"),
		a = document.getElementById("seleAreaThird");
	i.session = user.session;
	i.address = {
		id: 0,
		consignee: g.value,
		email: "",
		country: 1,
		province: h.value,
		city: a.value,
		district: d.value,
		address: c.value,
		zipcode: "",
		tel: f.value,
		mobile: "",
		sign_building: "",
		best_time: "",
		default_address: ""
	};
	if (b) {
		i.address_id = b
	}
	mui.sendRequest(e, i, function(j) {
		if (!j.status.succeed) {
			mui.toast(j.status.error_desc);
			return
		}
		mui.back()
	})
}

function Check_Consignee() {
	var g = document.getElementById("Name"),
		a = document.getElementById("Moblie"),
		f = document.getElementById("AddressInfo"),
		e = document.getElementById("seleAreaFouth"),
		d = document.getElementById("seleAreaNext"),
		c = document.getElementById("seleAreaThird");
	var b = /^\d{11}$/;
	if (g.value == "") {
		mui.alert("收货人姓名不能为空");
		g.focus();
		return false
	} else {
		if (a.value == "") {
			mui.alert("手机号码不能为空");
			a.focus();
			return false
		} else {
			if (!b.test(a.value)) {
				mui.alert("请输入正确的手机号码");
				a.focus();
				return false
			} else {
				if (f.value == "") {
					mui.alert("详细地址不能为空");
					f.focus();
					return false
				} else {
					if (e.value < 0 || e.value == "") {
						if (d.value == "") {
							mui.alert("请选择省份");
							d.focus();
							return false
						}
						if (c.value == "") {
							mui.alert("请选择市");
							c.focus();
							return false
						}
						if (document.getElementById("seleAreaFouth")[0].length == 1 && document.getElementById("seleAreaThird")[0].length > 1 && document.getElementById("seleAreaThird").value > -1) {
							return true
						} else {
							mui.alert("请选择区/县");
							e.focus();
							return false
						}
					} else {
						return true
					}
				}
			}
		}
	}
};