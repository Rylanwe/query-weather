$(document).ready(function() {
  $('main').hide();
  $.ajax({
    url: 'https://restapi.amap.com/v3/config/district',
    type: 'get',
    dataType: 'json',
    data: {
      key: '756c4e95b0474e867dbe566fbad3b607',
      keywords: '中国',
      subdistrict: 2
    },
    success: provinceSelect
  });
});

// 监听省份选择框变化，然后渲染该省份城市
$('.province-select select').on('change', function() {
  let provinceValue = $('.province-select select').val();
  if (provinceValue !== '请选择省份') {
    $.ajax({
      url: 'https://restapi.amap.com/v3/config/district',
      type: 'get',
      dataType: 'json',
      data: {
        key: '756c4e95b0474e867dbe566fbad3b607',
        keywords: provinceValue,
        subdistrict: 1
      },
      success: citySelect
    });
  }
});

// 监听查询按钮点击
$('.query-btn').on('click', function() {
  let provinceValue = $('.province-select select').val(),
      cityValue = $('.city-select select').val();
  if (provinceValue === '请选择省份') {
    alert('请选择省份');
  } else if (cityValue === '请选择城市') {
    alert('请选择城市');
  } else {
    $.ajax({
      url: 'https://wis.qq.com/weather/common',
      type: 'get',
      // 跨域
      dataType: 'jsonp',
      data: {
        source: 'pc',
        weather_type: 'forecast_1h',
        province: provinceValue,
        city: cityValue
      },
      success: weatherTable
    });
  }
})


// 省份选择框渲染
function provinceSelect(areaData) {
  let province = areaData.districts[0].districts;
  let provinceOption = '';
  province.forEach(item => {
    provinceOption += `<option>${ item.name }</option>`;
  });
  $('.province-select select').html('<option selected>请选择省份</option>' + provinceOption);
}


// 渲染城市选择框
function citySelect(areaData) {
  let city = areaData.districts[0].districts;
  let cityOption = '';
  city.forEach(item => {
    cityOption += `<option>${ item.name }</option>`;
  });
  $('.city-select select').html('<option selected>请选择城市</option>' + cityOption);
}

// 渲染天气表格
function weatherTable(weatherData) {
  $('main').show();

  let provinceValue = $('.province-select select').val(),
      cityValue = $('.city-select select').val();
  $('h2').text(`${ provinceValue }${ cityValue }未来天气`);

  let tbodyContent = '';
  let data = weatherData.data.forecast_1h;
  for (let key in data) {
    let val = data[key];
    let time = val.update_time,
        degree = val.degree,
        weather = val.weather,
        windDirection = val.wind_direction,
        windPower = val.wind_power;
    
      tbodyContent += `
      <tr>
        <td>${ time.substring(0, 4) }年${ time.substring(4, 6) }月${ time.substring(6, 8) }日${ time.substring(8, 10) }时</td>
        <td>${ degree } °C</td>
        <td>${ weather }</td>
        <td>${ windDirection }</td>
        <td>${ windPower } 级</td>
      </tr>
    `;
  }
  $('tbody').html(tbodyContent);
}
