// script.js
document.addEventListener("DOMContentLoaded", function () {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // 現在の月、前月、翌月、翌々月のカレンダーを生成
    generateCalendar("prev-month", currentMonth - 1, currentYear);
    generateCalendar("current-month", currentMonth, currentYear);
    generateCalendar("next-month", currentMonth + 1, currentYear);
    generateCalendar("next-next-month", currentMonth + 2, currentYear);
});

async function generateCalendar(containerId, month, year) {
    const container = document.getElementById(containerId);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    // Holidays JP API から祝日の日付を取得
    const holidays = await fetchHolidays(year);
    
    // 月表示の追加
    var monthStr = document.createElement("h2");
    monthStr.innerHTML = `${month + 1}月`;
    container.appendChild(monthStr);

    // カレンダーのテーブルを作成
    const table = document.createElement("table");

    const headRow = document.createElement("tr");
    const dows = ["日", "月", "火", "水", "木", "金", "土"];
    dows.forEach(function(dow) {
        const cell = document.createElement("th");
        cell.textContent = dow;
        headRow.appendChild(cell)
    });
    table.appendChild(headRow)


    for (let i = 0; i < 6; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < 7; j++) {
            const cell = document.createElement("td");
            const day = i * 7 + j - firstDay + 1;
            if (day > 0 && day <= daysInMonth) {
                cell.textContent = day;
                if (j === 0) {
                    cell.classList.add("sunday");
                }
                if (j === 6) {
                    cell.classList.add("saturday");
                }
                if (day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
                    cell.classList.add("today");
                }
                // 祝日のスタイリング
                console.log(`${year}-${(month + 1).toString().padStart(2, "0")}-${(day + 1).toString().padStart(2, "0")}`)
                
                if (holidays.includes(`${year}-${(month + 1).toString().padStart(2, "0")}-${(day).toString().padStart(2, "0")}`)) {
                    cell.classList.add("holiday");
                }
            }
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    container.appendChild(table);
}

// Holidays JP API から祝日の日付を取得する関数
async function fetchHolidays(year) {
    try {
        const response = await fetch(`https://holidays-jp.github.io/api/v1/${year}/date.json`);
        const data = await response.json();
        console.log(data)
        return Object.keys(data);
    } catch (error) {
        console.error("Error fetching holidays:", error);
        return [];
    }
}

// 例: 祝日のスタイリング
// .holiday {
//     background-color: red;
// }
