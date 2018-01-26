module.exports = {
    // 日期显示格式
    format: function(date, fmt) {
        fmt = fmt || 'YYYY-MM-DD HH:mm:ss';
        if (typeof date === 'string') {
            date = new Date(date.replace(/-/g, '/'))
        }
        if (typeof date === 'number') {
            date = new Date(date)
        }
        var o = {
            'M+': date.getMonth() + 1,
            'D+': date.getDate(),
            'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
            'H+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds(),
            'q+': Math.floor((date.getMonth() + 3) / 3),
            'S': date.getMilliseconds()
        }
        var week = {
            '0': '\u65e5',
            '1': '\u4e00',
            '2': '\u4e8c',
            '3': '\u4e09',
            '4': '\u56db',
            '5': '\u4e94',
            '6': '\u516d'
        }
        if (/(Y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') + week[date.getDay() + ''])
        }
        for (var k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
            }
        }
        return fmt;
    },
    // 是否相同的
    isEqual: function(src, desc) {
        return (
            src.getFullYear() === desc.getFullYear() &&
            src.getMonth() === desc.getMonth() &&
            src.getDate() === desc.getDate()
        );
    },
    getFirstDayOfMonth: function(month, year) {
        return new Date(year, month, 1)
    },
    getLastDayOfMonth: function(month, year) {
        return new Date(year, month + 1, 0)
    },
    calcAllDate: function(month, year) {
        let firstDate = this.getFirstDayOfMonth(month, year)
        let lastDate = this.getLastDayOfMonth(month, year).getDate()
        let dayOfFirstDate = firstDate.getDay()
        let afterPadNum = 42 - dayOfFirstDate - lastDate
        let dateArr = []
        for (let i = 0; i < dayOfFirstDate; i++) {
            dateArr[dayOfFirstDate - i - 1] = new Date(year, month, -i)
        }
        for (let i = 0; i < lastDate; i++) {
            dateArr.push(new Date(year, month, i + 1))
        }
        for (let i = 0; i < afterPadNum; i++) {
            dateArr.push(new Date(year, month + 1, i + 1))
        }
        return dateArr
    },
    getRangeYear: function(date) {
        let currentYear = date.getFullYear()
        let digitOfCurrentYear = Number((currentYear + '').split('').reverse()[0]);
        let startYear = currentYear - digitOfCurrentYear;
        return [startYear, startYear + 11]
    },
    getRangeDecade: function(date) {
        let currentDecade = date.getFullYear()
        let digitOfCurrentDecade = Number(currentDecade.toString().substr(-2));
        let startDecade = currentDecade - digitOfCurrentDecade;
        return [startDecade, startDecade + 119]
    },
    iso8601Week: function(date) {
        let time, checkDate = new Date(date);

        // Find Thursday of this week starting on Monday
        checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));

        time = checkDate.getTime();
        checkDate.setMonth(0); // Compare with Jan 1
        checkDate.setDate(1);
        return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
    },
    // 知道年份、周数，星期   求日期
    dateFromWeek: function(date) {
        let parts = date.match(/\d+/g);
        let year = parts[0];
        let week = parts[1];
        let day = parts[2] == 0 ? 7 : parts[2];
        let years = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        let leapYears = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
        let correct = new Date(new Date(new Date(year).setMonth(0)).setDate(4)).getDay() + 3;
        let totalDays = week * 7 + day * 1 - correct;
        let days = [];
        let diff = 0;
        let month = -1;
        let _date = -1;

        //判断是否为闰年，针对2月的天数进行计算
        if (Math.round(year / 4) == year / 4) {
            days = leapYears;
        } else {
            days = years;
        }

        for (let i = 1; i < days.length; i++) {
        	if (check(totalDays, days[i - 1], days[i])) {
        		month = i - 1;
        		_date = totalDays - days[month];
        	}
        }

        //参数str判断的字符串 m最小值 n最大值
        function check(str, m, n) {
            if (str>m&&str<=n) {
            	return true;
            } else {
            	return false;
            }
        }

        if (month === -1) {	
        	_date = totalDays - days[11];
        	return new Date(year+'-'+month+'-'+_date);
        } else {
        	return new Date(year+'-'+month+'-'+_date);
        }

    },
    convert: function(d) {
        return (
            d.constructor === Date ? d :
            d.constructor === Array ? new Date(d[0], d[1], d[2]) :
            d.constructor === Number ? new Date(d) :
            d.constructor === String ? new Date(d) :
            typeof d === "object" ? new Date(d.year, d.month, d.date) :
            NaN
        );
    },
    compare: function(a, b) {
        return (
            isFinite(a = this.convert(a).valueOf()) &&
            isFinite(b = this.convert(b).valueOf()) ?
            (a > b) - (a < b) :
            NaN
        );
    }
}