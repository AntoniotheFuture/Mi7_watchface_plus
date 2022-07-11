try {
  (() => {
    var __$$app$$__ = __$$hmAppManager$$__.currentApp;
    var __$$module$$__ = __$$app$$__.current;
    var h = new DeviceRuntimeCore.WidgetFactory(
      new DeviceRuntimeCore.HmDomApi(__$$app$$__, __$$module$$__),"WatchFace Plus"
    );
    var logger = DeviceRuntimeCore.HmLogger.getLogger("WatchFace Plus");
    ("use strict");

    function range(start, end, step = 1) {
      if (arguments.length === 1) {
        end = start
        start = 0
        step = 1
      }
      const result = []
      for (let i = start; i < end; i += step) {
        result.push(i)
      }
      return result
    }

    function showToast(t) {
      try {
        hmUI.showToast({
          text: t
        })
      } catch (e) {}
    }

    function setGroupVisible(ui, v) {
      ui.setProperty(hmUI.prop.VISIBLE, v);
    }

    //-------------------------resources------------------------------------

    const topBtnX = 55;
    const topBtnY = 2;
    const bottomBtnX = 55;
    const bottomBtnY = 425;
    const fullWidth = 192;
    const fullHeight = 490;
    const iconBtnW = 65;

    const normalFont = 22;
    const titleFont = 28;
    const smallFont = 16;
    const tinyFont = 12;
    const xTinyFont = 10;

    const darkBG = 0x000000;
    const lightBG = 0x202020;
    const lightText = 0xffffff;
    const darkText = 0x000000;
    const gold = 0xffd700;
    const secondText = 0xa5a5a5;
    const orange = 0xfc512d;
    const btnPress = 0x555555;

    let month_array = null
    let hour_array = null
    let week_array = null

    let moonArray = null
    let bgPics = null
    let frontPics = null

    let bat = null
    let bat_level = null

    let img_array = ['qr/alipay.png','qr/wechat.png']

    moonArray = range(30).map((v) => {
      return `m/${v + 1}.png`
    })
    bgPics = range(8).map((v) => {
      return `mo/${v + 1}.png`
    })
    frontPics = range(8).map((v) => {
      return `mo/${v + 1}f.png`
    })
    month_array = range(10).map((v) => {
      return `date/${v}.png`
    })
    hour_array = range(10).map((v) => {
      return `time/${v}.png`
    })
    week_array = range(7).map((v) => {
      return `week/${v + 1}.png`
    })
    bat = range(10).map((v) => {
      return `bat/${v}.png`
    })
    bat_level = range(11).map((v) => {
      return `batlevel/${v}.png`
    })

    const vibrate = hmSensor.createSensor(hmSensor.id.VIBRATE)
    const battery = hmSensor.createSensor(hmSensor.id.BATTERY)
    const jstime = hmSensor.createSensor(hmSensor.id.TIME)
    const step = hmSensor.createSensor(hmSensor.id.STEP)
    let views = [];
    let pages = ['home'];

    let isAutoBright
    let bright

    __$$module$$__.module = DeviceRuntimeCore.WatchFace({
      init_view() {
        let WatchFace = hmUI.createWidget(hmUI.widget.GROUP, {
          x: 0,
          y: 0,
          w: 192,
          h: 490,
          show_level: hmUI.show_level.ONLY_NORMAL
        });

        const bg = WatchFace.createWidget(hmUI.widget.IMG, {
          x: 0,
          y: 0,
          src: bgPics[0],
          //image_array: bgPics,
          //image_length: bgPics.length,
          //level: 1,
        })
        //-------------------------status----------------------------------
        WatchFace.createWidget(hmUI.widget.IMG_STATUS, {
          x: 10,
          y: 65,
          type: hmUI.system_status.DISCONNECT,
          src: 'state/bluetooth.png',
        })

        WatchFace.createWidget(hmUI.widget.IMG_STATUS, {
          x: 40,
          y: 65,
          type: hmUI.system_status.DISTURB,
          src: 'state/disturb.png',
        })

        WatchFace.createWidget(hmUI.widget.IMG_STATUS, {
          x: 70,
          y: 65,
          type: hmUI.system_status.LOCK,
          src: 'state/lock.png',
        })

        const batIcon = WatchFace.createWidget(hmUI.widget.IMG_LEVEL, {
          x: 140,
          y: 65,
          image_array: bat_level,
          image_length: bat_level.length,
          level: 10,
        })

        WatchFace.createWidget(hmUI.widget.TEXT_IMG, {
          x: 160,
          y: 65,
          font_array: bat,
          h_space: 1,
          align_h: hmUI.align.LEFT,
          type: hmUI.data_type.BATTERY,
          //text: '0',
        })

        //-------------------------date ,week & moon----------------------------------

        WatchFace.createWidget(hmUI.widget.IMG_DATE, {
          month_startX: 10,
          month_startY: 100,
          month_sc_array: month_array,
          month_tc_array: month_array,
          month_en_array: month_array,
          month_unit_sc: "24.png",
          month_unit_tc: "24.png",
          month_unit_en: "24.png",
          month_align: hmUI.align.LEFT,
          month_zero: 0,
          month_follow: 0,
          month_space: 1,
          month_is_character: !1,
          day_sc_array: month_array,
          day_tc_array: month_array,
          day_en_array: month_array,
          day_zero: 1,
          day_follow: 1,
          day_is_character: !1,
        })

        hmUI.createWidget(hmUI.widget.IMG_WEEK, {
          x: 106,
          y: 100,
          week_en: week_array,
          week_tc: week_array,
          week_sc: week_array,
        })

        const moonFace = WatchFace.createWidget(hmUI.widget.IMG, {
          x: 157,
          y: 100,
          src: moonArray[0],
        })

        //-------------------------time----------------------------------

        WatchFace.createWidget(hmUI.widget.IMG_TIME, {
          hour_zero: 1,
          hour_startX: 10,
          hour_startY: 160,
          hour_array: hour_array,
          hour_space: 3,
          hour_align: hmUI.align.RIGHT,
          minute_zero: 1,
          minute_array: hour_array,
          minute_follow: 1,
        })

        const frontPic = WatchFace.createWidget(hmUI.widget.IMG, {
          x: 0,
          y: 182,
          src: frontPics[0],
        })

        WatchFace.createWidget(hmUI.widget.IMG_TIME, {
          hour_zero: 1,
          hour_startX: 10,
          hour_startY: 160,
          hour_array: hour_array,
          hour_space: 3,
          hour_align: hmUI.align.RIGHT,
          minute_zero: 1,
          minute_array: hour_array,
          minute_startX: 0,
          minute_startY: 490,
          minute_follow: 0,
        })


        //--------------------stats---------------------------

        WatchFace.createWidget(hmUI.widget.IMG, {
          x: 76,
          y: 280,
          src: 'walk.png',
        })

        WatchFace.createWidget(hmUI.widget.TEXT_IMG, {
          x: 104,
          y: 280,
          type: hmUI.data_type.STEP,
          font_array: month_array,
          h_space: 1,
          align_h: hmUI.align.LEFT,
        })


        WatchFace.createWidget(hmUI.widget.IMG, {
          x: 76,
          y: 240,
          src: 'heart.png',
        })

        WatchFace.createWidget(hmUI.widget.TEXT_IMG, {
          x: 104,
          y: 240,
          type: hmUI.data_type.HEART,
          font_array: month_array,
          h_space: 1,
          align_h: hmUI.align.LEFT,
        })

        //--------------------AOD---------------------------

        hmUI.createWidget(hmUI.widget.IMG, {
          x: 0,
          y: 0,
          w: 192,
          h: 490,
          src: "33.png",
          show_level: hmUI.show_level.ONLY_AOD
        })

        hmUI.createWidget(hmUI.widget.TIME_POINTER, {
          hour_centerX: 96,
          hour_centerY: 245,
          hour_posX: 12,
          hour_posY: 68,
          hour_path: "34.png",
          hour_cover_path: "",
          hour_cover_x: 84,
          hour_cover_y: 233,
          minute_centerX: 96,
          minute_centerY: 245,
          minute_posX: 12,
          minute_posY: 84,
          minute_path: "36.png",
          minute_cover_path: "35.png",
          minute_cover_x: 84,
          minute_cover_y: 233,
          show_level: hmUI.show_level.ONLY_AOD
        })

        //---------------------------------apps-------------------------------------

        const appIcon = WatchFace.createWidget(hmUI.widget.IMG, {
          x: 38,
          y: 401,
          src: "apps.png",
          show_level: hmUI.show_level.ONLY_NORMAL
        })
        appIcon.addEventListener(hmUI.event.CLICK_DOWN, function (info) {
          if (pages[pages.length - 1] == 'home') {
            switchUI(false);
            pages.push("menu");
          }
        })

        function switchUI(b) {
          appIcon.setProperty(hmUI.prop.VISIBLE, b);
          setGroupVisible(menuGroup, !b);
          backButton.setProperty(hmUI.prop.VISIBLE, !b);
        }

        //---------------------------------menu-------------------------------------
        let menuItems = []
        let pageSize = 4;
        let offset = 0;

        let menuGroup = hmUI.createWidget(hmUI.widget.GROUP, {
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight
        })
        setGroupVisible(menuGroup, false);

        menuGroup.createWidget(hmUI.widget.FILL_RECT, {
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight,
          color: darkBG
        })

        var apps = [{
            text: '二维码1',
            id: 1
          },
          {
            text: '二维码2',
            id: 2
          },
          {
            text: '吃什么',
            id: 4
          },
          {
            text: '点数器',
            id: 3
          },
          {
            text: '骰子',
            id: 7
          },
          {
            text: '尺子',
            id: 6
          },
          {
            text: '关于',
            id: 5
          },
        ]

        for (let i = 0; i < apps.length; i++) {
          const app = apps[i];
          var m = menuGroup.createWidget(hmUI.widget.BUTTON, {
            x: 5,
            y: 70 + i % pageSize * 80,
            w: fullWidth - 10,
            h: 76,
            press_color: lightBG,
            normal_color: btnPress,
            text: app['text'],
            color: lightText,
            text_size: 28,
            radius: 48,
            click_func: () => {
              openApp(app['id'], )
            }
          })
          menuItems.push(m)
        }

        const nextPage = menuGroup.createWidget(hmUI.widget.IMG, {
          x: (fullWidth - iconBtnW) / 2,
          y: bottomBtnY,
          w: iconBtnW,
          h: 50,
          src: "next.png"
        })

        nextPage.addEventListener(hmUI.event.CLICK_DOWN, function (info) {
          switchMenu()
        })

        function switchMenu() {
          if (offset >= menuItems.length) {
            offset = 0
          }
          for (let i = 0; i < menuItems.length; i++) {
            const item = menuItems[i];
            item.setProperty(hmUI.prop.VISIBLE, (i >= offset && i < offset + pageSize))

          }
          offset += pageSize;
        }
        switchMenu()

        //---------------------------------wechat collect-------------------------------------

        let showIndex1 = 0;

        let app1Group = hmUI.createWidget(hmUI.widget.GROUP, {
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight
        })
        setGroupVisible(app1Group, false)

        app1Group.createWidget(hmUI.widget.FILL_RECT, {
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight,
          color: lightText
        })

        app1Group.createWidget(hmUI.widget.TEXT, {
          x: 0,
          y: 60,
          w: fullWidth,
          h: 50,
          color: darkBG,
          text: "二维码1",
          text_size: titleFont,
          text_style: hmUI.text_style.NONE,
          align_h: hmUI.align.CENTER_H,
        })

        const img1 = app1Group.createWidget(hmUI.widget.IMG, {
          x: 3,
          y: 120,
          src: 'qr/wechat.png',
          w: 186,
          h: 186,
        })

        const nextImg1 = app1Group.createWidget(hmUI.widget.IMG, {
          x: (fullWidth - iconBtnW) / 2,
          y: bottomBtnY,
          w: iconBtnW,
          h: 50,
          src: "next.png"
        })

        nextImg1.addEventListener(hmUI.event.CLICK_DOWN, function (info) {
          showIndex1 ++;
          if(showIndex1 >= img_array.length){
            showIndex1 = 0
          }
          img1.setProperty(hmUI.prop.MORE,{
            src:img_array[showIndex1]
          })
        })

        //-------------------------------- aplipay collect-------------------------------------

        let showIndex2 = 0;

        let app2Group = hmUI.createWidget(hmUI.widget.GROUP, {
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight
        })
        setGroupVisible(app2Group, false)

        app2Group.createWidget(hmUI.widget.FILL_RECT, {
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight,
          color: lightText
        })

        app2Group.createWidget(hmUI.widget.TEXT, {
          x: 0,
          y: 60,
          w: fullWidth,
          h: 50,
          color: darkBG,
          text: "二维码2",
          text_size: titleFont,
          text_style: hmUI.text_style.NONE,
          align_h: hmUI.align.CENTER_H,
        })

        const img2 = app2Group.createWidget(hmUI.widget.IMG, {
          x: 3,
          y: 120,
          src: 'qr/alipay.png',
          w: 186,
          h: 186,
        })

        const nextImg2 = app2Group.createWidget(hmUI.widget.IMG, {
          x: (fullWidth - iconBtnW) / 2,
          y: bottomBtnY,
          w: iconBtnW,
          h: 50,
          src: "next.png"
        })

        nextImg2.addEventListener(hmUI.event.CLICK_DOWN, function (info) {
          showIndex2++;
          if (showIndex2 >= img_array.length) {
            showIndex2 = 0
          }
          img2.setProperty(hmUI.prop.MORE, {
            src: img_array[showIndex2]
          })
        })

        //-------------------------------- counter-------------------------------------

        let count = 0;
        let doVibrate = true;

        let app3Group = hmUI.createWidget(hmUI.widget.GROUP, {
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight
        })
        setGroupVisible(app3Group, false)

        app3Group.createWidget(hmUI.widget.FILL_RECT, {
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight,
          color: darkBG
        })

        app3Group.createWidget(hmUI.widget.BUTTON, {
          x: 45,
          y: 60,
          w: 102,
          h: 50,
          text: '归零',
          press_color: lightBG,
          normal_color: btnPress,
          color: lightText,
          text_size: normalFont,
          radius: 15,
          click_func: () => {
            if (pages[pages.length - 1] != "app3") {
              return
            }
            count = 0;
            countText.setProperty(hmUI.prop.MORE, {
              text: count
            });
          }
        })

        const switchVibrate = app3Group.createWidget(hmUI.widget.BUTTON, {
          x: 45,
          y: 120,
          w: 102,
          h: 50,
          text: '震动开',
          press_color: lightBG,
          normal_color: btnPress,
          color: lightText,
          text_size: normalFont,
          radius: 15,
          click_func: () => {
            if (pages[pages.length - 1] != "app3") {
              return
            }
            doVibrate = !doVibrate;
            switchVibrate.setProperty(hmUI.prop.MORE, {
              text: '震动' + (doVibrate ? '开' : '关'),
              x: 45,
              y: 120,
              w: 102,
              h: 50,
            })
          }
        })

        const countText = app3Group.createWidget(hmUI.widget.TEXT, {
          x: 2,
          y: 172,
          w: fullWidth - 4,
          h: 70,
          align_h: hmUI.align.CENTER_H,
          align_v: hmUI.align.CENTER_V,
          text_size: 56,
          color: gold,
          text: 0
        })

        const addCount = app3Group.createWidget(hmUI.widget.FILL_RECT, {
          x: 0,
          y: 242,
          w: fullWidth,
          h: 250,
          radius: fullWidth / 2,
          color: 0x191970,
        })

        app3Group.createWidget(hmUI.widget.TEXT, {
          x: 2,
          y: 250,
          w: fullWidth - 4,
          h: 18,
          text_size: smallFont,
          color: secondText,
          align_h: hmUI.align.CENTER_H,
          align_v: hmUI.align.CENTER_V,
          text: "点击+1"
        })


        addCount.addEventListener(hmUI.event.CLICK_DOWN, function (info) {
          if (pages[pages.length - 1] != "app3") {
            return
          }
          count++;
          if (doVibrate) {
            vibrate.motorenable = 1
            vibrate.crowneffecton = 1
            vibrate.scene = 2
            try {
              vibrate.stop()
              vibrate.start()
            } catch (e) {
              showToast('不支持震动\n')
            }
          }
          countText.setProperty(hmUI.prop.MORE, {
            text: count
          });
        })

        //--------------------------------eat what-------------------------------------

        let fastFoods = ['云吞', '拉面', '烧烤', '米线', '螺蛳粉', '汉堡', '炸鸡', '披萨', '寿司', '手抓饼', '海鲜粥', '羊肉粉', '牛杂', '焗饭', '黄焖鸡',
          '猪脚饭', '白切鸡', '葱油鸡', '烧鸭饭', '烧鹅饭', '麻辣烫', '泡面', '盖浇饭', '泡馍', '麻辣香锅', '刀削面', '热干面', '桂林米粉', '酸辣粉', '饺子',
          '脆皮鸡饭', '关东煮', '凉皮', '烤肉拌饭', '包子', '馄饨', '炸酱面', '卤菜', '煲仔饭', '重庆小面', '意大利面', '酸菜鱼', '炒饭', '炒粉', '咖喱饭'
        ];
        let dinners = ['牛扒', '水煮鱼', '牛肉火锅', '日料', '烤鱼', '海鲜火锅', '冒菜', '海鲜自助', '烤肉自助', '韩国菜', '泰国菜', '北京菜', '麻辣火锅',
          '粤菜', '川菜', '东北菜', '云南菜', '江浙菜', '西北菜', '山东菜', '徽菜', '贵州菜', '台湾菜', '江西菜', '茶餐厅', '法国大餐', '鱼火锅', '酸菜鱼', '小龙虾'
        ];
        let fastFoodsStat = [];
        let dinnersStat = [];
        let fastfoodIndex = 0;
        let dinnerIndex = 1;


        let app4Group = hmUI.createWidget(hmUI.widget.GROUP, {
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight
        })
        setGroupVisible(app4Group, false)

        app4Group.createWidget(hmUI.widget.FILL_RECT, { // 自定义组件容器
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight,
          color: darkBG
        })

        app4Group.createWidget(hmUI.widget.BUTTON, {
          x: 5,
          y: 130,
          w: fullWidth - 10,
          h: 76,
          radius: 38,
          press_color: lightBG,
          normal_color: btnPress,
          text: '快餐',
          color: lightText,
          text_size: 28,
          click_func: () => {
            gotoFastfood()
          }
        })

        app4Group.createWidget(hmUI.widget.BUTTON, {
          x: 5,
          y: 250,
          w: fullWidth - 10,
          h: 76,
          radius: 38,
          press_color: lightBG,
          normal_color: btnPress,
          text: '正餐',
          color: lightText,
          text_size: 28,
          click_func: () => {
            gotoDinner()
          }
        })

        let fastfoodGroup = hmUI.createWidget(hmUI.widget.GROUP, {
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight
        })
        setGroupVisible(fastfoodGroup, false)

        fastfoodGroup.createWidget(hmUI.widget.FILL_RECT, { // 自定义组件容器
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight,
          color: darkBG
        })

        const fastfoodText = fastfoodGroup.createWidget(hmUI.widget.TEXT, {
          x: 0,
          y: 200,
          w: fullWidth,
          h: 50,
          align_h: hmUI.align.CENTER_H,
          text_size: titleFont,
          color: gold,
          text: '云吞'
        })

        const fastfoodCount = fastfoodGroup.createWidget(hmUI.widget.TEXT, {
          x: 0,
          y: 280,
          w: fullWidth,
          h: 50,
          align_h: hmUI.align.CENTER_H,
          text_size: normalFont,
          color: lightText,
          text: '还没选过'
        })

        fastfoodGroup.createWidget(hmUI.widget.BUTTON, {
          x: 45,
          y: 100,
          w: 102,
          h: 50,
          text: '选择',
          press_color: lightBG,
          normal_color: btnPress,
          color: lightText,
          text_size: normalFont,
          radius: 15,
          click_func: () => {
            if (pages[pages.length - 1] != "fastfood") {
              return
            }
            if (fastfoodIndex == -1) {
              return
            }
            if (typeof (fastFoodsStat[fastfoodIndex + '']) == 'undefined') {
              fastFoodsStat[fastfoodIndex + ''] = 0;
            } else {
              fastFoodsStat[fastfoodIndex + '']++;
            }
            updateFastFoodCount()
          }
        })

        const refreshFastfood = fastfoodGroup.createWidget(hmUI.widget.IMG, {
          x: (fullWidth - iconBtnW) / 2,
          y: bottomBtnY,
          w: iconBtnW,
          h: 50,
          src: "refresh.png"
        })

        refreshFastfood.addEventListener(hmUI.event.CLICK_DOWN, function (info) {
          if (pages[pages.length - 1] != "fastfood") {
            return
          }
          fastfoodIndex = Math.round(Math.random() * fastFoods.length)
          updateFastFoodCount()
          fastfoodText.setProperty(hmUI.prop.MORE, {
            text: fastFoods[fastfoodIndex]
          });
        })

        function updateFastFoodCount() {
          fastfoodCount.setProperty(hmUI.prop.MORE, {
            text: fastFoodsStat[fastfoodIndex + ''] ? '已选' + fastFoodsStat[fastfoodIndex + ''] + '次' : '还没选过'
          });
        }

        let dinnerGroup = hmUI.createWidget(hmUI.widget.GROUP, {
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight
        })
        setGroupVisible(dinnerGroup, false)

        dinnerGroup.createWidget(hmUI.widget.FILL_RECT, {
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight,
          color: darkBG
        })

        const dinnerText = dinnerGroup.createWidget(hmUI.widget.TEXT, {
          x: 0,
          y: 200,
          w: fullWidth,
          h: 100,
          align_h: hmUI.align.CENTER_H,
          text_size: titleFont,
          color: gold,
          text: '水煮鱼'
        })

        const dinnerCount = dinnerGroup.createWidget(hmUI.widget.TEXT, {
          x: 0,
          y: 280,
          w: fullWidth,
          h: 50,
          align_h: hmUI.align.CENTER_H,
          text_size: normalFont,
          color: lightText,
          text: '还没选过'
        })

        dinnerGroup.createWidget(hmUI.widget.BUTTON, {
          x: 60,
          y: 100,
          w: 72,
          h: 50,
          text: '选择',
          press_color: lightBG,
          normal_color: btnPress,
          color: lightText,
          text_size: normalFont,
          radius: 15,
          click_func: () => {
            if (pages[pages.length - 1] != "dinner") {
              return
            }
            if (dinnerIndex == -1) {
              return
            }
            if (typeof (dinnersStat[dinnerIndex + '']) == 'undefined') {
              dinnersStat[dinnerIndex + ''] = 0;
            } else {
              dinnersStat[dinnerIndex + '']++;
            }
            updateDinnerCount()
          }
        })

        
        const refreshDinner = dinnerGroup.createWidget(hmUI.widget.IMG, { //小程序图标
          x: (fullWidth - iconBtnW) / 2,
          y: bottomBtnY,
          w: iconBtnW,
          h: 50,
          src: "refresh.png"
        })

        refreshDinner.addEventListener(hmUI.event.CLICK_DOWN, function (info) {
          if (pages[pages.length - 1] != "dinner") {
            return
          }
          dinnerIndex = Math.round(Math.random() * dinners.length)
          updateDinnerCount()
          dinnerText.setProperty(hmUI.prop.MORE, {
            text: dinners[dinnerIndex]
          });
        })


        function updateDinnerCount() {
          dinnerCount.setProperty(hmUI.prop.MORE, {
            text: dinnersStat[dinnerIndex + ''] ? '已选' + dinnersStat[dinnerIndex + ''] + '次' : '还没选过'
          });
        }

        function gotoFastfood() {
          if (pages[pages.length - 1] != "app4") {
            return
          }
          goin(fastfoodGroup)
          pages.push('fastfood')
        }

        function gotoDinner() {
          if (pages[pages.length - 1] != "app4") {
            return
          }
          goin(dinnerGroup)
          pages.push('dinner')
        }

        //--------------------------------about -------------------------------------

        let logStr = 'log:'

        let app5Group = hmUI.createWidget(hmUI.widget.GROUP, {
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight
        })
        setGroupVisible(app5Group, false)

        app5Group.createWidget(hmUI.widget.FILL_RECT, {
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight,
          color: darkBG
        })

        app5Group.createWidget(hmUI.widget.TEXT, {
          x: 5,
          y: 80,
          w: fullWidth - 10,
          h: 32,
          text: '增强版表盘',
          text_size: titleFont,
          color: lightText,

          text_style: hmUI.text_style.NONE
        })

        app5Group.createWidget(hmUI.widget.TEXT, {
          x: 5,
          y: 110,
          w: fullWidth - 10,
          h: 24,
          text: '开发者：梁小蜗',
          text_size: smallFont,
          color: orange,
          text_style: hmUI.text_style.WRAP
        })

        app5Group.createWidget(hmUI.widget.TEXT, {
          x: 5,
          y: 140,
          w: fullWidth - 10,
          h: 80,
          text: '这是免费开源软件，如果您付费了，请联系卖家退款',
          align_h: hmUI.align.LEFT,
          text_size: smallFont,
          color: lightText,
          text_style: hmUI.text_style.WRAP
        })

        const logNav = app5Group.createWidget(hmUI.widget.IMG, {
          x: 5,
          y: 250,
          w: fullWidth - 10,
          h: 200,
          src: 'qr.png'
        })

        const logBg = app5Group.createWidget(hmUI.widget.FILL_RECT, {
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight,
          color: darkBG
        })

        const logs = app5Group.createWidget(hmUI.widget.TEXT, {
          x: 0,
          y: 80,
          w: fullWidth - 10,
          h: fullHeight - 80,
          text: 'log:',
          align_h: hmUI.align.LEFT,
          text_size: tinyFont,
          color: lightText,
          text_style: hmUI.text_style.WRAP
        })

        logBg.setProperty(hmUI.prop.VISIBLE, false)
        logs.setProperty(hmUI.prop.VISIBLE, false)

        logNav.addEventListener(hmUI.event.CLICK_DOWN, function (info) {
          if (pages[pages.length - 1] != "app5") {
            return
          }
          logBg.setProperty(hmUI.prop.VISIBLE, true)
          logs.setProperty(hmUI.prop.VISIBLE, true)
        })
        logs.addEventListener(hmUI.event.CLICK_DOWN, function (info) {
          if (pages[pages.length - 1] != "app5") {
            return
          }
          logBg.setProperty(hmUI.prop.VISIBLE, false)
          logs.setProperty(hmUI.prop.VISIBLE, false)
        })

        function pushLog(log) {
          logStr += log
          if (logStr.length > 160) {
            logStr = logStr.substring(logStr.length - 150, 160)
          }
          logs.setProperty(hmUI.prop.MORE, {
            text: logStr
          })
        }

        //--------------------------------ruler-------------------------------------

        let app6Group = hmUI.createWidget(hmUI.widget.GROUP, {
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight
        })
        setGroupVisible(app6Group, false)

        app6Group.createWidget(hmUI.widget.IMG, {
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight,
          src: 'ruler.png'
        })

        //--------------------------------touzi-------------------------------------
  
        let touziGame = {
          game : 0,
          touCount: 4,
          tou1: 0,
          tou2: 0,
          tou3: 0,
          tou4: 0,
          refresh:function(){
            if(touCount > 0) {tou1 = Math.round(Math.random() * 5)}
            if (touCount > 1) {tou2 = Math.round(Math.random() * 5)}
            if (touCount > 2) {tou3 = Math.round(Math.random() * 5)}
            if (touCount > 3) {tou4 = Math.round(Math.random() * 5)}
          },
          reset:function(){
            game = 0;
            tou1 = 0;
            tou2 = 0;
            tou3 = 0;
            tou4 = 0;
          },
          changeTouCount:function(n){
            touCount += n
            if (touCount < 2) {touCount = 1;}
            if (touCount > 3) {touCount = 4}
          }
        }

        let app7Group = hmUI.createWidget(hmUI.widget.GROUP, {
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight
        })
        setGroupVisible(app7Group, false)

        app7Group.createWidget(hmUI.widget.FILL_RECT, {
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight,
          color: darkBG
        })

        const touStat = app7Group.createWidget(hmUI.widget.BUTTON, {
          x: 21,
          y: 60,
          w: 150,
          h: 80,
          text: '第1轮\n总点数0',
          press_color: lightBG,
          normal_color: btnPress,
          color: lightText,
          text_size: normalFont,
          radius: 15,
          click_func: () => {
            goin(app7EditGroup)
            pages.push('rules')
          }
        })

        const tou1Img = app7Group.createWidget(hmUI.widget.IMG, {
          x: 10,
          y: 150,
          w: 81,
          h: 81,
          src: 'tou/6.png'
        })

        const tou2Img = app7Group.createWidget(hmUI.widget.IMG, {
          x: 101,
          y: 150,
          w: 81,
          h: 81,
          src: 'tou/6.png'
        })

        const tou3Img = app7Group.createWidget(hmUI.widget.IMG, {
          x: 10,
          y: 241,
          w: 81,
          h: 81,
          src: 'tou/6.png'
        })

        const tou4Img = app7Group.createWidget(hmUI.widget.IMG, {
          x: 101,
          y: 241,
          w: 81,
          h: 81,
          src: 'tou/6.png'
        })

        const refreshTou = app7Group.createWidget(hmUI.widget.IMG, {
          x: (fullWidth - iconBtnW) / 2,
          y: bottomBtnY,
          w: iconBtnW,
          h: 50,
          src: "refresh.png"
        })

        refreshTou.addEventListener(hmUI.event.CLICK_DOWN, function (info) {
          let t
          if (touziGame.touCount > 0) {
            t = touziGame.tou1 + 1
            tou1Img.setProperty(hmUI.prop.MORE, {
              src: 'tou/' + t + '.png'
            })
          }
          if (touCount > 1) {
            t = touziGame.tou2 + 1
            tou2Img.setProperty(hmUI.prop.MORE, {
              src: 'tou/' + t + '.png'
            })
          }
          if (touCount > 2) {
            t = touziGame.tou3 + 1
            tou3Img.setProperty(hmUI.prop.MORE, {
              src: 'tou/' + t + '.png'
            })
          }
          if (touCount > 3) {
            t = touziGame.tou4 + 1
            tou4Img.setProperty(hmUI.prop.MORE, {
              src: 'tou/' + t + '.png'
            })
          }
          updateGameStat()
        })


        let app7EditGroup = hmUI.createWidget(hmUI.widget.GROUP, {
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight
        })
        setGroupVisible(app7EditGroup, false)

        app7EditGroup.createWidget(hmUI.widget.FILL_RECT, {
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight,
          color: darkBG
        })

        app7EditGroup.createWidget(hmUI.widget.BUTTON, {
          x: 21,
          y: 60,
          w: 150,
          h: 80,
          text: '重置游戏',
          press_color: lightBG,
          normal_color: btnPress,
          color: lightText,
          text_size: normalFont,
          radius: 15,
          click_func: () => {
            touziGame.reset()
            updateGameStat()
            showToast('重置完毕')
          }
        })

        const ruleStr = app7EditGroup.createWidget(hmUI.widget.TEXT, {
          x: 21,
          y: 150,
          w: 150,
          h: 40,
          text: '骰子数量：4',
          color: lightText,
          text_size: normalFont
        })

        app7EditGroup.createWidget(hmUI.widget.BUTTON, {
          x: 10,
          y: 240,
          w: 81,
          h: 75,
          text: '-1',
          press_color: lightBG,
          normal_color: btnPress,
          color: lightText,
          text_size: normalFont,
          radius: 15,
          click_func: () => {
            touziGame.changeTouCount(-1)
            updateTouCount()
            ruleStr.setProperty(hmUI.prop.MORE, {
              text: '骰子数量：' + touziGame.touCount
            })
          }
        })

        app7EditGroup.createWidget(hmUI.widget.BUTTON, {
          x: 101,
          y: 240,
          w: 81,
          h: 75,
          text: '+1',
          press_color: lightBG,
          normal_color: btnPress,
          color: lightText,
          text_size: normalFont,
          radius: 15,
          click_func: () => {
            touziGame.changeTouCount(1)
            updateTouCount()
            ruleStr.setProperty(hmUI.prop.MORE, {
              text: '骰子数量：' + touziGame.touCount
            })
          }
        })

        function updateTouCount() {
          tou1Img.setProperty(hmUI.prop.VISIBLE, touziGame.touCount > 0)
          tou2Img.setProperty(hmUI.prop.VISIBLE, touziGame.touCount > 1)
          tou3Img.setProperty(hmUI.prop.VISIBLE, touziGame.touCount > 2)
          tou4Img.setProperty(hmUI.prop.VISIBLE, touziGame.touCount > 3)
        }

        function updateGameStat() {
          touziGame.game++;
          var total = 0;
          total += (touziGame.touCount > 0 ? (touziGame.tou1 + 1) : 0)
          total += (touziGame.touCount > 1 ? (touziGame.tou2 + 1) : 0)
          total += (touziGame.touCount > 2 ? (touziGame.tou3 + 1) : 0)
          total += (touziGame.touCount > 3 ? (touziGame.tou4 + 1) : 0)
          touStat.setProperty(hmUI.prop.MORE, {
            x: 21,
            y: 60,
            w: 150,
            h: 80,
            text: '第' + touziGame.game + '轮\n总点数' + total,
          })
        }

        //--------------------------------input box-------------------------------------

        var inputTarget = null;
        var inputStr = '';
        var inputCode = '';

        let inputGroup = hmUI.createWidget(hmUI.widget.GROUP, {
          x: 0,
          y: 0,
          w: fullWidth,
          h: fullHeight
        })
        setGroupVisible(inputGroup, false)

        inputGroup.createWidget(hmUI.widget.FILL_RECT, {
          x: 0,
          y: 94,
          w: fullWidth,
          h: 84,
          radius: 15,
          color: btnPress
        })

        let inputBox = inputGroup.createWidget(hmUI.widget.TEXT, {
          x: 5,
          y: 96,
          w: fullWidth - 10,
          h: 80,
          text: '',
          text_size: smallFont,
          line_space: 2,
          color: lightText,
          text_style: hmUI.text_style.WRAP
        })

        let inputCodeBox = inputGroup.createWidget(hmUI.widget.TEXT, {
          x: 5,
          y: 220,
          w: fullWidth - 10,
          h: 24,
          text: '',
          text_size: smallFont,
          line_space: 2,
          color: lightText,
          text_style: hmUI.text_style.WRAP
        })

        inputGroup.createWidget(hmUI.widget.BUTTON, {
          x: 2,
          y: 250,
          text: '0',
          w: (fullWidth - 6) / 2,
          h: 66,
          radius: 5,
          text_size: titleFont,
          color: lightText,
          press_color: lightBG,
          normal_color: btnPress,
          click_func: () => {
            inputCodeX('0')
          }
        })

        inputGroup.createWidget(hmUI.widget.BUTTON, {
          x: (fullWidth - 6) / 2 + 4,
          y: 250,
          text: '1',
          w: (fullWidth - 6) / 2,
          h: 66,
          radius: 5,
          text_size: titleFont,
          color: lightText,
          press_color: lightBG,
          normal_color: btnPress,
          click_func: () => {
            inputCodeX('1')
          }
        })

        inputGroup.createWidget(hmUI.widget.BUTTON, {
          x: 2,
          y: 320,
          text: '2',
          w: (fullWidth - 6) / 2,
          h: 66,
          radius: 5,
          text_size: titleFont,
          color: lightText,
          press_color: lightBG,
          normal_color: btnPress,
          click_func: () => {
            inputCodeX('2')
          }
        })

        inputGroup.createWidget(hmUI.widget.BUTTON, {
          x: (fullWidth - 6) / 2 + 4,
          y: 320,
          text: '3',
          w: (fullWidth - 6) / 2,
          h: 66,
          radius: 5,
          text_size: titleFont,
          color: lightText,
          press_color: lightBG,
          normal_color: btnPress,
          click_func: () => {
            inputCodeX('3')
          }
        })

        inputGroup.createWidget(hmUI.widget.BUTTON, {
          x: fullWidth / 3,
          y: 390,
          text: '←',
          w: fullWidth / 3,
          h: 66,
          radius: 5,
          text_size: titleFont,
          color: lightText,
          press_color: lightBG,
          normal_color: btnPress,
          click_func: () => {
            backSpace()
          }
        })

        function inputCodeX(n) {
          if (inputCode.length > 3) {
            inputCode = '';
          } else {
            inputCode += '' + n;
            if (inputCode.length == 4) {
              if (ks[inputCode] != undefined) {
                inputStr += ks[inputCode];
                updateInputBox()
              }
              inputCode = ''
            }
          }
          inputCodeBox.setProperty(hmUI.prop.MORE, {
            text: inputCode
          })
        }

        function updateInputBox() {
          inputBox.setProperty(hmUI.prop.MORE, {
            text: inputStr
          })
        }

        function backSpace() {
          if (inputCode.length > 0) {
            inputCode = inputCode.substring(0, inputCode.length - 1)
            inputCodeBox.setProperty(hmUI.prop.MORE, {
              text: inputCode
            })
          } else {
            if (inputStr.length > 0) {
              inputStr = inputStr.substring(0, inputStr.length - 1)
              updateInputBox()
            }
          }
        }

        //---------------------------------nav----------------------------------------
        const backButton = hmUI.createWidget(hmUI.widget.IMG, {
          x: (fullWidth - iconBtnW) / 2,
          y: topBtnY,
          src: "back.png",
        })
        backButton.setProperty(hmUI.prop.VISIBLE, false);
        backButton.addEventListener(hmUI.event.CLICK_DOWN, function (info) {
          goback();
        })
        
        //--------------------------------utils-------------------------------------

        function openApp(i) {
          if (pages[pages.length - 1] != "menu") {
            return
          }
          switch (i) {
            case 1:
              goin(app1Group)
              break;
            case 2:
              goin(app2Group)
              break;
            case 3:
              goin(app3Group)
              break;
            case 4:
              goin(app4Group)
              break;
            case 5:
              goin(app5Group)
              break;
            case 6:
              goin(app6Group)
              break;
            case 7:
              goin(app7Group)
              break;
            default:
              return
          }
          pages.push("app" + i)
        }

        function goback() { //返回上一层
          if (pages.length > 1) {
            var page = pages.pop()
            if (page == 'edit') {
              setGroupVisible(inputGroup, false)
              if (inputTarget == 'wechat') {
                wechatCode = inputStr
                updateWechatCode()
              }
              if (inputTarget == 'alipay') {
                alipayCode = inputStr
                updateAlipayCode()
              }
              setMaxBright()
            }
            if (page == 'app1' || page == 'app2') {
              resetBright()
            }
          }
          if (views.length <= 0) {
            switchUI(true)
            return
          }
          var ui = views.pop();
          setGroupVisible(ui, false)
        }

        function goin(ui) {
          views.push(ui);
          if (ui == app1Group || ui == app2Group) {
            checkBright()
            setMaxBright()
          }
          setGroupVisible(ui, true);
        }

        function checkBright() {
          try {
            isAutoBright = hmSetting.getScreenAutoBright()
            if (!isAutoBright) {
              bright = hmSetting.getBrightness()
            }
          } catch (e) {}
        }

        function setMaxBright() {
          try {
            hmSetting.setScreenAutoBright(false)
            hmSetting.setBrightness(100)
          } catch (e) {
          }
        }

        function resetBright() {
          try {
            if (isAutoBright) {
              hmSetting.setScreenAutoBright()
            } else {
              hmSetting.setBrightness(bright)
            }
          } catch (e) {}
        }

        function updateBG() {
          var h = Math.ceil(jstime.hour / 3)
          if (h > bgPics.length - 1) {
            return
          }
          bg.setProperty(hmUI.prop.MORE, {
            src: bgPics[h]
          })
          frontPic.setProperty(hmUI.prop.MORE, {
            src: frontPics[h]
          })
          if(jstime.lunar_day){
            moonFace.setProperty(hmUI.prop.MORE, {
              src: moonArray[jstime.lunar_day]
            })
          }
          if (battery.current){
            batIcon.setProperty(hmUI.prop.MORE, {
              x: 140,
              y: 65,
              level: Math.floor(battery.current / 10)
            })
          }
          pushLog('update bg\n')
        }

        pushLog('V1.1\n')
        updateBG()

        battery.addEventListener(hmSensor.event.CHANGE, function () {
          updateBG()
        })

        let lastStep = 0;

        step.addEventListener(hmSensor.event.CHANGE, function () {
          if (step.current > lastStep + 80 || step.current < lastStep){
            lastStep = step.current
            updateBG()
          }
        })


        // function startTime(){
        //   try {
        //     mainTimer = createTimer(
        //       500,
        //       1000, //1800000
        //       function (option) {
        //         var h = Math.ceil((option.s) / 3) //jstime.hour
        //         showToast("h:"+h)
        //         p.log("h:" + h)
        //         if (h > bgPics.length - 1) {
        //           return
        //         }
        //         bg.setProperty(hmUI.prop.MORE, {
        //           type: h - 1
        //         })
        //         frontPic.setProperty(hmUI.prop.MORE, {
        //           level: h - 1
        //         })
        //         //updateMoonFace()
        //       },
        //       { hour: jstime.hour,s:jstime.second }
        //     );
        //   } catch (e) {
        //     p.log(e)
        //   }
        // }

        // hmUI.createWidget(hmUI.widget.WIDGET_DELEGATE, {
        //   resume_call: function () {
        //     startTime()
        //   },
        //   pause_call: function () {
        //     timer.stopTimer(mainTimer)
        //     p.log('ui pause')
        //   },
        // })

        var ks = {
          '0200': ' ',
          '0201': '!',
          '0202': '"',
          '0203': '#',
          '0210': '$',
          '0211': '%',
          '0212': '&',
          '0213': '\'',
          '0220': '\(',
          '0221': ')',
          '0222': '*',
          '0223': '+',
          '0230': ',',
          '0231': '-',
          '0232': '.',
          '0233': '/',
          '0300': '0',
          '0301': '1',
          '0302': '2',
          '0303': '3',
          '0310': '4',
          '0311': '5',
          '0312': '6',
          '0313': '7',
          '0320': '8',
          '0321': '9',
          '0322': ':',
          '0323': ';',
          '0330': '<',
          '0331': '=',
          '0332': '>',
          '0333': '?',
          '1000': '@',
          '1001': 'A',
          '1002': 'B',
          '1003': 'C',
          '1010': 'D',
          '1011': 'E',
          '1012': 'F',
          '1013': 'G',
          '1020': 'H',
          '1021': 'I',
          '1022': 'J',
          '1023': 'K',
          '1030': 'L',
          '1031': 'M',
          '1032': 'N',
          '1033': 'O',
          '1100': 'P',
          '1101': 'Q',
          '1102': 'R',
          '1103': 'S',
          '1110': 'T',
          '1111': 'U',
          '1112': 'V',
          '1113': 'W',
          '1120': 'X',
          '1121': 'Y',
          '1122': 'Z',
          '1123': '[',
          '1130': '\\',
          '1131': ']',
          '1132': '^',
          '1133': '_',
          '1200': '`',
          '1201': 'a',
          '1202': 'b',
          '1203': 'c',
          '1210': 'd',
          '1211': 'e',
          '1212': 'f',
          '1213': 'g',
          '1220': 'h',
          '1221': 'i',
          '1222': 'j',
          '1223': 'k',
          '1230': 'l',
          '1231': 'm',
          '1232': 'n',
          '1233': 'o',
          '1300': 'p',
          '1301': 'q',
          '1302': 'r',
          '1303': 's',
          '1310': 't',
          '1311': 'u',
          '1312': 'v',
          '1313': 'w',
          '1320': 'x',
          '1321': 'y',
          '1322': 'z',
          '1323': '{',
          '1330': '|',
          '1331': '}',
          '1332': '~',
        }
      },
      onInit() {
        this.init_view()
        logger.log("index page.js on init invoke");
      },
      build() {
        logger.log("index page.js on ready invoke");
      },
      onDestory() {
        logger.log("index page.js on destory invoke");
      }
    });
  })();
} catch (n) {
  console.log(n);
  try {
    var logger2 = DeviceRuntimeCore.HmLogger.getLogger("WatchFace Plus");
    logger2.log(n)
  } catch (e) {}
}