function dateFormat(fmt, date ,n , type) {
    let ret;
    if (type == 'd' || type == null) {
        if (n) {
            var t = date.getTime() + (n * 24 * 60 * 60 * 1000);
            date.setTime(t);
        }
    }
    if (type == 'm') {
        var m = 0;
        if (n) {
            m = parseInt(date.getMonth() + n);
            date.setMonth(m);
        }
    }
    if (type == 'y') {
        var y = 0;
        if (n) {
            y = date.getFullYear() + n;
            date.setFullYear(y);
        }
    }
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}

export default dateFormat;