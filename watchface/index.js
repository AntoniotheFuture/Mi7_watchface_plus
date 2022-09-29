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

    const green = 0x8fc31f;

    let month_array = null
    let hour_array = null
    let week_array = null

    let moonArray = null
    let bgPics = null
    let frontPics = null

    let bat = null
    let bat_level = null

    let img_array = ['qr/alipay.png','qr/wechat.png']

    moonArray = range(29).map((v) => {
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

        const moonFace = WatchFace.createWidget(hmUI.widget.IMG_LEVEL, {
          x: 156,
          y: 100,
          image_array: moonArray,
          image_length: moonArray.length,
          type: hmUI.data_type.MOON
        })
        
        // .createWidget(hmUI.widget.IMG, {
        //   x: 157,
        //   y: 100,
        //   src: moonArray[0],
        // })



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

        //---------------------------------wechat collect-------------------------------------

        var qr1 = {
          title: '二维码1',
          showText:'wxp://f2f0eWEfpXmzZbm81ToT4fYhhnx1_w1LvQzoYkZ1ZuZ-nYM',
          group: null,
          qrcode:null,
          editBtn:null,
          init: function () {
            qr1.group = hmUI.createWidget(hmUI.widget.GROUP, {
              x: 0,
              y: 0,
              w: fullWidth,
              h: fullHeight
            })

            setGroupVisible(qr1.group, false)

            qr1.group.createWidget(hmUI.widget.FILL_RECT, {
              x: 0,
              y: 0,
              w: fullWidth,
              h: fullHeight,
              color: lightText
            })

            qr1.group.createWidget(hmUI.widget.TEXT, {
              x: 0,
              y: 60,
              w: fullWidth,
              h: 50,
              color: darkBG,
              text: qr1.title,
              text_size: titleFont,
              text_style: hmUI.text_style.NONE,
              align_h: hmUI.align.CENTER_H,
            })

            qr1.qrcode = qr1.group.createWidget(hmUI.widget.QRCODE, {
              content: qr1.showText,
              x: 3,
              y: 120,
              w: fullWidth - 6,
              h: fullWidth - 6,
              bg_x: 0,
              bg_y: 116,
              bg_w: fullWidth,
              bg_h: fullWidth
            })

            qr1.editBtn = qr1.group.createWidget(hmUI.widget.IMG, {
              x: (fullWidth - iconBtnW) / 2,
              y: bottomBtnY,
              w: iconBtnW,
              h: 50,
              src: "edit.png"
            })

           
          },
          update:function(){
            qr1.qrcode.setProperty(hmUI.prop.MORE, {
              content: qr1.showText,
              x: 3,
              y: 120,
              w: fullWidth - 6,
              h: fullWidth - 6,
              bg_x: 0,
              bg_y: 116,
              bg_w: fullWidth,
              bg_h: fullWidth
            })
            logger.log("qrcode updated:" + qr1.showText);
          }
        }

        //-------------------------------- aplipay collect-------------------------------------

        var qr2 = {
          title: '二维码2',
          showText: 'https://qr.alipay.com/fkx181795dfsbwm8usxip57',
          group: null,
          qrcode: null,
          editBtn: null,
          editGroup: null,
          init: function () {
            qr2.group = hmUI.createWidget(hmUI.widget.GROUP, {
              x: 0,
              y: 0,
              w: fullWidth,
              h: fullHeight
            })

            setGroupVisible(qr2.group, false)

            qr2.group.createWidget(hmUI.widget.FILL_RECT, {
              x: 0,
              y: 0,
              w: fullWidth,
              h: fullHeight,
              color: lightText
            })

            qr2.group.createWidget(hmUI.widget.TEXT, {
              x: 0,
              y: 60,
              w: fullWidth,
              h: 50,
              color: darkBG,
              text: qr2.title,
              text_size: titleFont,
              text_style: hmUI.text_style.NONE,
              align_h: hmUI.align.CENTER_H,
            })

            qr2.qrcode = qr2.group.createWidget(hmUI.widget.QRCODE, {
              content: qr2.showText,
              x: 3,
              y: 120,
              w: fullWidth - 6,
              h: fullWidth - 6,
              bg_x: 0,
              bg_y: 116,
              bg_w: fullWidth,
              bg_h: fullWidth
            })

            qr2.editBtn = qr2.group.createWidget(hmUI.widget.IMG, {
              x: (fullWidth - iconBtnW) / 2,
              y: bottomBtnY,
              w: iconBtnW,
              h: 50,
              src: "edit.png"
            })

          },
          update: function () {
            qr2.qrcode.setProperty(hmUI.prop.MORE, {
              content: qr2.showText,
              x: 3,
              y: 120,
              w: fullWidth - 6,
              h: fullWidth - 6,
              bg_x: 0,
              bg_y: 116,
              bg_w: fullWidth,
              bg_h: fullWidth
            })
            logger.log("qrcode updated:" + qr2.showText);
          }
        }

        //-------------------------------- counter-------------------------------------
        var counter = {
          title: '点数器',
          count: 0,
          doVibrate: true,
          group: null,
          switchVibrate: null,
          countText: null,
          addCount: null,
          init: function () {
            counter.group = hmUI.createWidget(hmUI.widget.GROUP, {
              x: 0,
              y: 0,
              w: fullWidth,
              h: fullHeight
            })
            setGroupVisible(counter.group, false)

            counter.group.createWidget(hmUI.widget.FILL_RECT, {
              x: 0,
              y: 0,
              w: fullWidth,
              h: fullHeight,
              color: darkBG
            })

            counter.group.createWidget(hmUI.widget.BUTTON, {
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
                if (pages[pages.length - 1] != counter.title) {
                  return
                }
                counter.count = 0;
                counter.countText.setProperty(hmUI.prop.MORE, {
                  text: counter.count
                });
              }
            })

            counter.switchVibrate = counter.group.createWidget(hmUI.widget.BUTTON, {
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
                if (pages[pages.length - 1] != counter.title) {
                  return
                }
                counter.doVibrate = !counter.doVibrate;
                counter.switchVibrate.setProperty(hmUI.prop.MORE, {
                  text: '震动' + (counter.doVibrate ? '开' : '关'),
                  x: 45,
                  y: 120,
                  w: 102,
                  h: 50,
                })
              }
            })

            counter.countText = counter.group.createWidget(hmUI.widget.TEXT, {
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

            counter.addCount = counter.group.createWidget(hmUI.widget.FILL_RECT, {
              x: 0,
              y: 242,
              w: fullWidth,
              h: 250,
              radius: fullWidth / 2,
              color: 0x191970,
            })

            counter.group.createWidget(hmUI.widget.TEXT, {
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


            counter.addCount.addEventListener(hmUI.event.CLICK_DOWN, function (info) {
              if (pages[pages.length - 1] != counter.title) {
                return
              }
              counter.count++;
              if (counter.doVibrate) {
                try {
                  vibrate.motorenable = 1
                  vibrate.crowneffecton = 1
                  vibrate.scene = 23
                
                  vibrate.stop()
                  vibrate.start()
                } catch (e) {
                  showToast('不支持震动\n')
                }
              }
              counter.countText.setProperty(hmUI.prop.MORE, {
                text: counter.count
              });
            })
          }
        }

        //--------------------------------eat what-------------------------------------

        var eatWhat = {
          title: '吃什么',
          group: null,
          fastfood: {
            options: ['云吞', '拉面', '烧烤', '米线', '螺蛳粉', '汉堡', '炸鸡', '披萨', '寿司', '手抓饼', '海鲜粥', '羊肉粉', '牛杂', '焗饭', '黄焖鸡',
              '猪脚饭', '白切鸡', '葱油鸡', '烧鸭饭', '烧鹅饭', '麻辣烫', '泡面', '盖浇饭', '泡馍', '麻辣香锅', '刀削面', '热干面', '桂林米粉', '酸辣粉', '饺子',
              '脆皮鸡饭', '关东煮', '凉皮', '烤肉拌饭', '包子', '馄饨', '炸酱面', '卤菜', '煲仔饭', '重庆小面', '意大利面', '酸菜鱼', '炒饭', '炒粉', '咖喱饭'
            ],
            stats: [],
            index: 0,
            group:null,
            text: null,
            count: null,
            refreshBtn: null,
            updateCount: function () {
              eatWhat.fastfood.count.setProperty(hmUI.prop.MORE, {
                text: eatWhat.fastfood.stats[eatWhat.fastfood.index + ''] ? '已选' + eatWhat.fastfood.stats[eatWhat.fastfood.index + ''] + '次' : '还没选过'
              });
            }
          },
          dinner: {
            options: ['牛扒', '水煮鱼', '牛肉火锅', '日料', '烤鱼', '海鲜火锅', '冒菜', '海鲜自助', '烤肉自助', '韩国菜', '泰国菜', '北京菜', '麻辣火锅',
              '粤菜', '川菜', '东北菜', '云南菜', '江浙菜', '西北菜', '山东菜', '徽菜', '贵州菜', '台湾菜', '江西菜', '茶餐厅', '法国大餐', '鱼火锅', '酸菜鱼', '小龙虾'
            ],
            stats: [],
            index: 0,
            group: null,
            text: null,
            count: null,
            refreshBtn: null,
            updateCount: function () {
              eatWhat.dinner.count.setProperty(hmUI.prop.MORE, {
                text: eatWhat.dinner.stats[eatWhat.dinner.index + ''] ? '已选' + eatWhat.dinner.stats[eatWhat.dinner.index + ''] + '次' : '还没选过'
              });
            }
          },
          init: function () {
            eatWhat.group = hmUI.createWidget(hmUI.widget.GROUP, {
              x: 0,
              y: 0,
              w: fullWidth,
              h: fullHeight
            })
            setGroupVisible(eatWhat.group, false)

            eatWhat.group.createWidget(hmUI.widget.FILL_RECT, {
              x: 0,
              y: 0,
              w: fullWidth,
              h: fullHeight,
              color: darkBG
            })

            eatWhat.group.createWidget(hmUI.widget.BUTTON, {
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
                eatWhat.gotoFastfood()
              }
            })

            eatWhat.group.createWidget(hmUI.widget.BUTTON, {
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
                eatWhat.gotoDinner()
              }
            })

            eatWhat.fastfood.group = hmUI.createWidget(hmUI.widget.GROUP, {
              x: 0,
              y: 0,
              w: fullWidth,
              h: fullHeight
            })

            setGroupVisible(eatWhat.fastfood.group, false)

            eatWhat.fastfood.group.createWidget(hmUI.widget.FILL_RECT, {
              x: 0,
              y: 0,
              w: fullWidth,
              h: fullHeight,
              color: darkBG
            })

            eatWhat.fastfood.text = eatWhat.fastfood.group.createWidget(hmUI.widget.TEXT, {
              x: 0,
              y: 200,
              w: fullWidth,
              h: 50,
              align_h: hmUI.align.CENTER_H,
              text_size: titleFont,
              color: gold,
              text: '云吞'
            })

            eatWhat.fastfood.count = eatWhat.fastfood.group.createWidget(hmUI.widget.TEXT, {
              x: 0,
              y: 280,
              w: fullWidth,
              h: 50,
              align_h: hmUI.align.CENTER_H,
              text_size: normalFont,
              color: lightText,
              text: '还没选过'
            })

            eatWhat.fastfood.group.createWidget(hmUI.widget.BUTTON, {
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
                if (eatWhat.fastfood.index == -1) {
                  return
                }
                if (typeof (eatWhat.fastfood.stats[eatWhat.fastfood.index + '']) == 'undefined') {
                  eatWhat.fastfood.stats[eatWhat.fastfood.index + ''] = 0;
                } else {
                  eatWhat.fastfood.stats[eatWhat.fastfood.index + '']++;
                }
                eatWhat.fastfood.updateCount()
              }
            })

            eatWhat.fastfood.refreshBtn = eatWhat.fastfood.group.createWidget(hmUI.widget.IMG, {
              x: (fullWidth - iconBtnW) / 2,
              y: bottomBtnY,
              w: iconBtnW,
              h: 50,
              src: "refresh.png"
            })

            eatWhat.fastfood.refreshBtn.addEventListener(hmUI.event.CLICK_DOWN, function (info) {
              if (pages[pages.length - 1] != "fastfood") {
                return
              }
              eatWhat.fastfood.index = Math.round(Math.random() * eatWhat.fastfood.options.length)
              eatWhat.fastfood.updateCount()
              eatWhat.fastfood.text.setProperty(hmUI.prop.MORE, {
                text: eatWhat.fastfood.options[eatWhat.fastfood.index]
              });
            })

            eatWhat.dinner.group = hmUI.createWidget(hmUI.widget.GROUP, {
              x: 0,
              y: 0,
              w: fullWidth,
              h: fullHeight
            })

            setGroupVisible(eatWhat.dinner.group, false)

            eatWhat.dinner.group.createWidget(hmUI.widget.FILL_RECT, {
              x: 0,
              y: 0,
              w: fullWidth,
              h: fullHeight,
              color: darkBG
            })

            eatWhat.dinner.text = eatWhat.dinner.group.createWidget(hmUI.widget.TEXT, {
              x: 0,
              y: 200,
              w: fullWidth,
              h: 100,
              align_h: hmUI.align.CENTER_H,
              text_size: titleFont,
              color: gold,
              text: '水煮鱼'
            })

            eatWhat.dinner.count = eatWhat.dinner.group.createWidget(hmUI.widget.TEXT, {
              x: 0,
              y: 280,
              w: fullWidth,
              h: 50,
              align_h: hmUI.align.CENTER_H,
              text_size: normalFont,
              color: lightText,
              text: '还没选过'
            })

            eatWhat.dinner.group.createWidget(hmUI.widget.BUTTON, {
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
                if (eatWhat.dinner.index == -1) {
                  return
                }
                if (typeof (eatWhat.dinner.stats[eatWhat.dinner.index + '']) == 'undefined') {
                  eatWhat.dinner.stats[eatWhat.dinner.index + ''] = 0;
                } else {
                  eatWhat.dinner.stats[eatWhat.dinner.index + '']++;
                }
                eatWhat.dinner.updateCount()
              }
            })

            eatWhat.dinner.refreshBtn = eatWhat.dinner.group.createWidget(hmUI.widget.IMG, {
              x: (fullWidth - iconBtnW) / 2,
              y: bottomBtnY,
              w: iconBtnW,
              h: 50,
              src: "refresh.png"
            })

            eatWhat.dinner.refreshBtn.addEventListener(hmUI.event.CLICK_DOWN, function (info) {
              if (pages[pages.length - 1] != "dinner") {
                return
              }
              eatWhat.dinner.index = Math.round(Math.random() * eatWhat.dinner.options.length)
              eatWhat.dinner.updateCount()
              eatWhat.dinner.text.setProperty(hmUI.prop.MORE, {
                text: eatWhat.dinner.options[eatWhat.dinner.index]
              });
            })

          },
          gotoFastfood: function () {
            if (pages[pages.length - 1] != eatWhat.title) {
              return
            }
            goin(eatWhat.fastfood.group)
            pages.push('fastfood')
          },
          gotoDinner: function () {
            if (pages[pages.length - 1] != eatWhat.title) {
              return
            }
            goin(eatWhat.dinner.group)
            pages.push('dinner')
          },
        }

        //--------------------------------about -------------------------------------
        var about = {
          title: '关于',
          group: null,
          logStr: 'log:',
          logNav:null,
          logBg:null,
          logs:null,
          pushLog: function (log){
            about.logStr += log
            if (about.logStr.length > 160) {
              about.logStr = about.logStr.substring(about.logStr.length - 150, 160)
            }
            about.logs.setProperty(hmUI.prop.MORE, {
              text: about.logStr
            })
          },
          init:function(){
            about.group = hmUI.createWidget(hmUI.widget.GROUP, {
              x: 0,
              y: 0,
              w: fullWidth,
              h: fullHeight
            })
            setGroupVisible(about.group, false)

            about.group.createWidget(hmUI.widget.FILL_RECT, {
              x: 0,
              y: 0,
              w: fullWidth,
              h: fullHeight,
              color: darkBG
            })

            about.group.createWidget(hmUI.widget.TEXT, {
              x: 5,
              y: 80,
              w: fullWidth - 10,
              h: 32,
              text: '增强版表盘',
              text_size: titleFont,
              color: lightText,
              text_style: hmUI.text_style.NONE
            })

            about.group.createWidget(hmUI.widget.TEXT, {
              x: 5,
              y: 110,
              w: fullWidth - 10,
              h: 24,
              text: '开发者：梁小蜗',
              text_size: smallFont,
              color: orange,
              text_style: hmUI.text_style.WRAP
            })

            about.group.createWidget(hmUI.widget.TEXT, {
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

            about.logNav = about.group.createWidget(hmUI.widget.IMG, {
              x: 5,
              y: 250,
              w: fullWidth - 10,
              h: 200,
              src: 'qr.png'
            })

            about.logBg = about.group.createWidget(hmUI.widget.FILL_RECT, {
              x: 0,
              y: 0,
              w: fullWidth,
              h: fullHeight,
              color: darkBG
            })

            about.logs = about.group.createWidget(hmUI.widget.TEXT, {
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
            about.logBg.setProperty(hmUI.prop.VISIBLE, false)
            about.logs.setProperty(hmUI.prop.VISIBLE, false)

            about.logNav.addEventListener(hmUI.event.CLICK_DOWN, function (info) {
              if (pages[pages.length - 1] != about.title) {
                return
              }
              about.logBg.setProperty(hmUI.prop.VISIBLE, true)
              about.logs.setProperty(hmUI.prop.VISIBLE, true)
            })

            about.logs.addEventListener(hmUI.event.CLICK_DOWN, function (info) {
              if (pages[pages.length - 1] != about.title) {
                return
              }
              about.logBg.setProperty(hmUI.prop.VISIBLE, false)
              about.logs.setProperty(hmUI.prop.VISIBLE, false)
            })



          }
        }
        //--------------------------------ruler-------------------------------------

        var ruler = {
          title:'尺子',
          group:null,
          init:function(){
            ruler.group = hmUI.createWidget(hmUI.widget.GROUP, {
              x: 0,
              y: 0,
              w: fullWidth,
              h: fullHeight
            })
            setGroupVisible(ruler.group, false)

            ruler.group.createWidget(hmUI.widget.IMG, {
              x: 0,
              y: 0,
              w: fullWidth,
              h: fullHeight,
              src: 'ruler.png'
            })
          }
        }


        //--------------------------------touzi-------------------------------------
        
        var touzi = {
          title:'骰子',
          group:null,
          touziGame:{
            game: 0,
            touCount: 4,
            tou1: 0,
            tou2: 0,
            tou3: 0,
            tou4: 0,
            refresh: function () {
              if (this.touCount > 0) { this.tou1 = Math.round(Math.random() * 5) }
              if (this.touCount > 1) { this.tou2 = Math.round(Math.random() * 5) }
              if (this.touCount > 2) { this.tou3 = Math.round(Math.random() * 5) }
              if (this.touCount > 3) { this.tou4 = Math.round(Math.random() * 5) }
            },
            reset: function () {
              this.game = 0;
              this.tou1 = 0;
              this.tou2 = 0;
              this.tou3 = 0;
              this.tou4 = 0;
            },
            changeTouCount: function (n) {
              this.touCount += n
              if (this.touCount < 2) { this.touCount = 1; }
              if (this.touCount > 3) { this.touCount = 4 }
            }
          },
          touStat:null,
          editGroup:null,
          imgs:{
            tou1:null,
            tou2:null,
            tou3:null,
            tou4:null
          },
          ruleStr:null,

          refreshTou:null,
          updateGameStat:function(){
            touzi.touziGame.game++;
            var total = 0;
            total += (touzi.touziGame.touCount > 0 ? (touzi.touziGame.tou1 + 1) : 0)
            total += (touzi.touziGame.touCount > 1 ? (touzi.touziGame.tou2 + 1) : 0)
            total += (touzi.touziGame.touCount > 2 ? (touzi.touziGame.tou3 + 1) : 0)
            total += (touzi.touziGame.touCount > 3 ? (touzi.touziGame.tou4 + 1) : 0)
            touzi.touStat.setProperty(hmUI.prop.MORE, {
              x: 21,
              y: 60,
              w: 150,
              h: 80,
              text: '第' + touzi.touziGame.game + '轮\n总点数' + total,
            })
          },
          updateTouCount:function(){
            touzi.imgs.tou1.setProperty(hmUI.prop.VISIBLE, touzi.touziGame.touCount > 0)
            touzi.imgs.tou2.setProperty(hmUI.prop.VISIBLE, touzi.touziGame.touCount > 1)
            touzi.imgs.tou3.setProperty(hmUI.prop.VISIBLE, touzi.touziGame.touCount > 2)
            touzi.imgs.tou4.setProperty(hmUI.prop.VISIBLE, touzi.touziGame.touCount > 3)
          },
          init:function(){
            touzi.group = hmUI.createWidget(hmUI.widget.GROUP, {
              x: 0,
              y: 0,
              w: fullWidth,
              h: fullHeight
            })
            setGroupVisible(touzi.group, false)

            touzi.group.createWidget(hmUI.widget.FILL_RECT, {
              x: 0,
              y: 0,
              w: fullWidth,
              h: fullHeight,
              color: darkBG
            })

            touzi.touStat = touzi.group.createWidget(hmUI.widget.BUTTON, {
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
                goin(touzi.editGroup)
                pages.push('rules')
              }
            })

            touzi.imgs.tou1 = touzi.group.createWidget(hmUI.widget.IMG, {
              x: 10,
              y: 150,
              w: 81,
              h: 81,
              src: 'tou/6.png'
            })

            touzi.imgs.tou2 = touzi.group.createWidget(hmUI.widget.IMG, {
              x: 101,
              y: 150,
              w: 81,
              h: 81,
              src: 'tou/6.png'
            })

            touzi.imgs.tou3 = touzi.group.createWidget(hmUI.widget.IMG, {
              x: 10,
              y: 241,
              w: 81,
              h: 81,
              src: 'tou/6.png'
            })

            touzi.imgs.tou4 = touzi.group.createWidget(hmUI.widget.IMG, {
              x: 101,
              y: 241,
              w: 81,
              h: 81,
              src: 'tou/6.png'
            })

            touzi.refreshTou = touzi.group.createWidget(hmUI.widget.IMG, {
              x: (fullWidth - iconBtnW) / 2,
              y: bottomBtnY,
              w: iconBtnW,
              h: 50,
              src: "refresh.png"
            })

            touzi.refreshTou.addEventListener(hmUI.event.CLICK_DOWN, function (info) {
              let t
              touzi.touziGame.refresh()
              if (touzi.touziGame.touCount > 0) {
                t = touzi.touziGame.tou1 + 1
                touzi.imgs.tou1.setProperty(hmUI.prop.MORE, {
                  src: 'tou/' + t + '.png'
                })
              }
              if (touzi.touziGame.touCount > 1) {
                t = touzi.touziGame.tou2 + 1
                touzi.imgs.tou2.setProperty(hmUI.prop.MORE, {
                  src: 'tou/' + t + '.png'
                })
              }
              if (touzi.touziGame.touCount > 2) {
                t = touzi.touziGame.tou3 + 1
                touzi.imgs.tou3.setProperty(hmUI.prop.MORE, {
                  src: 'tou/' + t + '.png'
                })
              }
              if (touzi.touziGame.touCount > 3) {
                t = touzi.touziGame.tou4 + 1
                touzi.imgs.tou4.setProperty(hmUI.prop.MORE, {
                  src: 'tou/' + t + '.png'
                })
              }
              touzi.updateGameStat()
            })


            touzi.editGroup = hmUI.createWidget(hmUI.widget.GROUP, {
              x: 0,
              y: 0,
              w: fullWidth,
              h: fullHeight
            })
            setGroupVisible(touzi.editGroup, false)

            touzi.editGroup.createWidget(hmUI.widget.FILL_RECT, {
              x: 0,
              y: 0,
              w: fullWidth,
              h: fullHeight,
              color: darkBG
            })

            touzi.editGroup.createWidget(hmUI.widget.BUTTON, {
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
                touzi.touziGame.reset()
                touzi.updateGameStat()
                showToast('重置完毕')
              }
            })

            touzi.ruleStr = touzi.editGroup.createWidget(hmUI.widget.TEXT, {
              x: 21,
              y: 150,
              w: 150,
              h: 40,
              text: '骰子数量：4',
              color: lightText,
              text_size: normalFont
            })

            touzi.editGroup.createWidget(hmUI.widget.BUTTON, {
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
                touzi.touziGame.changeTouCount(-1)
                touzi.updateTouCount()
                touzi.ruleStr.setProperty(hmUI.prop.MORE, {
                  text: '骰子数量：' + touzi.touziGame.touCount
                })
              }
            })

            touzi.editGroup.createWidget(hmUI.widget.BUTTON, {
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
                touzi.touziGame.changeTouCount(1)
                touzi.updateTouCount()
                touzi.ruleStr.setProperty(hmUI.prop.MORE, {
                  text: '骰子数量：' + touzi.touziGame.touCount
                })
              }
            })
          }
        }

        //--------------------------------Metronome-------------------------------------
        var metronome = {
          title:'节拍器',
          bpm:88,
          group:null,
          editGroup:null,
          editBtn:null,
          playBtn:null,
          meters:[],
          timer:null,
          vibrateLevel:2,
          switchVibrate:null,
          current:0,
          t:0,
          edit:{
            bpm:null
          },
          resetMeters:function(){
            for (let i = 0; i < metronome.meters.length ; i++) {
              const element = metronome.meters[i];
              element.setProperty(hmUI.prop.MORE, {
                x: i < 4 ? 5 : 105,
                y: i % 4 * 60 + 166,
                w: 85,
                h: 55,
                color: 0x505050,
              })
            }
          },
          updateMeters:function(){
            var element = metronome.meters[metronome.current]
            var i = metronome.current
            if (metronome.current == 0 || metronome.current == 4){
              element.setProperty(hmUI.prop.MORE, {
                x: i < 4 ? 5 : 105,
                y: i % 4 * 60 + 166,
                w: 85,
                h: 55,
                color: gold,
              })
              if (metronome.vibrateLevel > 0){
                var vscene = 24
                switch(metronome.vibrateLevel){
                  case 1:vscene = 23;break;
                  case 2: vscene = 24; break;
                  case 3: vscene = 25; break;
                  default:break;
                }
                try {
                  vibrate.motorenable = 1
                  vibrate.crowneffecton = 1
                  vibrate.scene = vscene
                
                  vibrate.stop()
                  vibrate.start()
                } catch (e) {
                  showToast('不支持震动\n')
                }
              }
            }else{
              element.setProperty(hmUI.prop.MORE, {
                x: i < 4 ? 5 : 105,
                y: i % 4 * 60 + 166,
                w: 85,
                h: 55,
                color: green,
              })
            }
          },
          editBpm:function(x){
            metronome.bpm += x
            if(metronome.bpm > 360){
              metronome.bpm = 360
            }
            if (metronome.bpm < 1) {
              metronome.bpm = 1
            }
            metronome.edit.bpm.setProperty(hmUI.prop.MORE, {
              text: 'BPM：' + metronome.bpm
            })
            metronome.editBtn.setProperty(hmUI.prop.MORE, {
              text: metronome.bpm,
              x: 21,
              y: 60,
              w: 150,
              h: 80,
            })
          },
          init:function(){
            metronome.group = hmUI.createWidget(hmUI.widget.GROUP, {
              x: 0,
              y: 0,
              w: fullWidth,
              h: fullHeight
            })
            setGroupVisible(metronome.group, false)

            metronome.group.createWidget(hmUI.widget.FILL_RECT, {
              x: 0,
              y: 0,
              w: fullWidth,
              h: fullHeight,
              color: darkBG
            })

            metronome.editBtn = metronome.group.createWidget(hmUI.widget.BUTTON, {
              x: 21,
              y: 60,
              w: 150,
              h: 80,
              text: '88',
              press_color: lightBG,
              normal_color: btnPress,
              color: lightText,
              text_size: titleFont,
              radius: 15,
              click_func: () => {
                goin(metronome.editGroup)
                pages.push('setting')
              }
            })

            for (let i = 0; i < 8; i++) {
              metronome.meters.push(metronome.group.createWidget(hmUI.widget.FILL_RECT, {
                x: i < 4 ? 5 : 105,
                y: i % 4 * 60 + 166,
                w: 85,
                h: 55,
                radius: 5,
                color: 0x505050
              }))
            }

            metronome.playBtn = metronome.group.createWidget(hmUI.widget.IMG, {
              x: (fullWidth - iconBtnW) / 2,
              y: bottomBtnY,
              w: iconBtnW,
              h: 50,
              src: "play.png"
            })
            
            metronome.playBtn.addEventListener(hmUI.event.CLICK_DOWN, function (info) {
              if(metronome.timer == null){
                metronome.resetMeters()
                metronome.current = 0
                metronome.t = 0
                metronome.updateMeters()
                metronome.timer = timer.createTimer(
                  0,
                  50,
                  function (option) {
                    metronome.t += 50
                    var s = 60000 / metronome.bpm 
                    if(metronome.t >= s){
                      metronome.t = metronome.t % s 
                      metronome.current ++
                      if(metronome.current > 7){
                        metronome.current = 0
                        metronome.resetMeters()
                      }
                      metronome.updateMeters()
                    }
                  },
                  {}
                )
              }else{
                timer.stopTimer(metronome.timer)
                metronome.timer = null
              }
            })
            metronome.editGroup = hmUI.createWidget(hmUI.widget.GROUP, {
              x: 0,
              y: 0,
              w: fullWidth,
              h: fullHeight
            })
            setGroupVisible(metronome.editGroup, false)

            metronome.editGroup.createWidget(hmUI.widget.FILL_RECT, {
              x: 0,
              y: 0,
              w: fullWidth,
              h: fullHeight,
              color: darkBG
            })

            metronome.edit.bpm = metronome.editGroup.createWidget(hmUI.widget.TEXT, {
              x: 21,
              y: 80,
              w: fullWidth,
              h: 40,
              text: 'BPM：88',
              color: lightText,
              text_size: normalFont,
              align_h: hmUI.align.CENTER_H
            })
            
            metronome.editGroup.createWidget(hmUI.widget.BUTTON, {
              x: 2,
              y: 250,
              text: '-1',
              w: (fullWidth - 6) / 2,
              h: 66,
              radius: 5,
              text_size: titleFont,
              color: lightText,
              press_color: lightBG,
              normal_color: btnPress,
              click_func: () => {
                metronome.editBpm(-1)
              }
            })

            metronome.editGroup.createWidget(hmUI.widget.BUTTON, {
              x: (fullWidth - 6) / 2 + 4,
              y: 250,
              text: '+1',
              w: (fullWidth - 6) / 2,
              h: 66,
              radius: 5,
              text_size: titleFont,
              color: lightText,
              press_color: lightBG,
              normal_color: btnPress,
              click_func: () => {
                metronome.editBpm(1)
              }
            })

            metronome.editGroup.createWidget(hmUI.widget.BUTTON, {
              x: 2,
              y: 320,
              text: '-5',
              w: (fullWidth - 6) / 2,
              h: 66,
              radius: 5,
              text_size: titleFont,
              color: lightText,
              press_color: lightBG,
              normal_color: btnPress,
              click_func: () => {
                metronome.editBpm(-5)
              }
            })

            metronome.editGroup.createWidget(hmUI.widget.BUTTON, {
              x: (fullWidth - 6) / 2 + 4,
              y: 320,
              text: '+5',
              w: (fullWidth - 6) / 2,
              h: 66,
              radius: 5,
              text_size: titleFont,
              color: lightText,
              press_color: lightBG,
              normal_color: btnPress,
              click_func: () => {
                metronome.editBpm(5)
              }
            })

            metronome.switchVibrate = metronome.editGroup.createWidget(hmUI.widget.BUTTON, {
              x: fullWidth / 4,
              y: 390,
              text: '震动:中',
              w: fullWidth / 2,
              h: 66,
              radius: 5,
              text_size: titleFont,
              color: lightText,
              press_color: lightBG,
              normal_color: btnPress,
              click_func: () => {
                metronome.vibrateLevel ++
                if(metronome.vibrateLevel > 3){
                  metronome.vibrateLevel = 0
                }
                var levelText = '无'
                switch(metronome.vibrateLevel){
                  case 0: levelText = '无';break;
                  case 1: levelText = '低'; break;
                  case 2: levelText = '中'; break;
                  case 3: levelText = '高'; break;
                  default:break;
                }
                metronome.switchVibrate.setProperty(hmUI.prop.MORE, {
                  text: '震动:' + levelText,
                  x: fullWidth / 4,
                  y: 390,
                  w: fullWidth / 2,
                  h: 66,
                })
              }
            })


          },
          play:function(){

          }
        }


        //--------------------------------apps-------------------------------------
        var apps = [qr1, qr2, eatWhat, counter, touzi, metronome,ruler, about]

        for (let i = 0; i < apps.length; i++) {
          const app = apps[i];
          var m = menuGroup.createWidget(hmUI.widget.BUTTON, {
            x: 5,
            y: 70 + i % pageSize * 80,
            w: fullWidth - 10,
            h: 76,
            press_color: lightBG,
            normal_color: btnPress,
            text: app.title,
            color: lightText,
            text_size: 28,
            radius: 48,
            click_func: () => {
              openApp(i)
            }
          })
          menuItems.push(m)
        }

       

        for (let i = 0; i < apps.length; i++) {
          const app = apps[i];
          app.init()
        }

        switchMenu()


        //--------------------------------input box-------------------------------------

        var input = {
          title:'输入框',
          group:null,
          inputTarget:null,
          inputStr:'',
          inputCode:'',
          inputBox:null,
          inputCodeBox:null,
          inputCodeX:function(t){
            if (input.inputCode.length > 3) {
              input.inputCode = '';
            } else {
              input.inputCode += '' + t;
              if (input.inputCode.length == 4) {
                if (ks[input.inputCode] != undefined) {
                  input.inputStr += ks[input.inputCode];
                  input.updateInputBox()
                }
                input.inputCode = ''
              }
            }
            input.inputCodeBox.setProperty(hmUI.prop.MORE, {
              text: input.inputCode
            })
          },
          backSpace:function(){
            if (input.inputCode.length > 0) {
              input.inputCode = input.inputCode.substring(0, input.inputCode.length - 1)
              input.inputCodeBox.setProperty(hmUI.prop.MORE, {
                text: input.inputCode
              })
            } else {
              if (input.inputStr.length > 0) {
                input.inputStr = input.inputStr.substring(0, input.inputStr.length - 1)
                input.updateInputBox()
              }
            }
          },
          updateInputBox:function(){
            input.inputBox.setProperty(hmUI.prop.MORE, {
              text: input.inputStr
            })
          },
          init:function(){
            input.group = hmUI.createWidget(hmUI.widget.GROUP, {
              x: 0,
              y: 0,
              w: fullWidth,
              h: fullHeight
            })
            setGroupVisible(input.group, false)

            input.group.createWidget(hmUI.widget.FILL_RECT, {
              x: 0,
              y: 0,
              w: fullWidth,
              h: fullHeight,
              radius: 0,
              color: darkBG
            })

            input.group.createWidget(hmUI.widget.FILL_RECT, {
              x: 0,
              y: 94,
              w: fullWidth,
              h: 84,
              radius: 15,
              color: btnPress
            })

            input.inputBox = input.group.createWidget(hmUI.widget.TEXT, {
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

            input.inputCodeBox = input.group.createWidget(hmUI.widget.TEXT, {
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

            input.group.createWidget(hmUI.widget.BUTTON, {
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
                input.inputCodeX('0')
              }
            })

            input.group.createWidget(hmUI.widget.BUTTON, {
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
                input.inputCodeX('1')
              }
            })

            input.group.createWidget(hmUI.widget.BUTTON, {
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
                input.inputCodeX('2')
              }
            })

            input.group.createWidget(hmUI.widget.BUTTON, {
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
                input.inputCodeX('3')
              }
            })

            input.group.createWidget(hmUI.widget.BUTTON, {
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
               input.backSpace()
              }
            })

            qr1.editBtn.addEventListener(hmUI.event.CLICK_DOWN, function (info) {
              input.inputTarget = 'qr1'
              input.inputStr = qr1.showText
              goin(input.group)
              pages.push('edit')
              input.updateInputBox()
            })


            qr2.editBtn.addEventListener(hmUI.event.CLICK_DOWN, function (info) {
              input.inputTarget = 'qr2'
              input.inputStr = qr2.showText
              goin(input.group)
              pages.push('edit')
              input.updateInputBox()
            })


          }
        }

        input.init()
        


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
          goin(apps[i].group)
          pages.push(apps[i].title)
        }

        function goback() { //返回上一层
          if (pages.length > 1) {
            var page = pages.pop()
            if (page == 'edit') {
              setGroupVisible(input.group, false)
              if (input.inputTarget == 'qr1') {
                qr1.showText = input.inputStr
                qr1.update()
              }
              if (input.inputTarget == 'qr2') {
                qr2.showText = input.inputStr
                qr2.update()
              }
              setMaxBright()
            }
            if (page == '二维码1' || page == '二维码2') {
              resetBright()
            }
            if(page == '节拍器'){
              if(metronome.timer != null){
                timer.stopTimer(metronome.timer)
              }
              hmSetting.setBrightScreenCancel()
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
          if (ui == qr1.group || ui == qr2.group) {
            checkBright()
            setMaxBright()
          }
          if(ui == metronome.group){
            hmSetting.setBrightScreen(600)
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
          }else{
            var moonX = Math.floor((Date.now() - 576000000) / 2551392000)
            moonFace.setProperty(hmUI.prop.MORE, {
              src: moonArray[moonX]
            })
          }
          about.pushLog("bat:" + battery.current)
          if (battery.current){
            batIcon.setProperty(hmUI.prop.MORE, {
              x: 140,
              y: 65,
              level: Math.floor(battery.current / 10)
            })
          }
        }

        about.pushLog('V1.2\n')
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