// @ts-nocheck
import { useState, useEffect } from 'react';

interface OutlineStreamProps {
  topic: string;
  tags: string[];
  onConfirm: (outline: string) => void;
  onBack: () => void;
}

const OutlineStream = ({ topic, tags, onConfirm, onBack }: OutlineStreamProps) => {
  const [outline, setOutline] = useState('');
  const [isStreaming, setIsStreaming] = useState(true);

  // 模拟流式生成大纲
  useEffect(() => {
    const mockOutline = `# ${topic}

# 魅力之都大上海

## 开场
- 引入主题：播放一段上海繁华街景、璀璨夜景的视频，引出本次介绍的主题——上海。
- 介绍重要性和必要性：阐述了解上海这座国际化大都市对于拓宽视野、了解中国经济文化发展的重要意义。
由于当前调用图片生成接口的QPS过高，暂时无法为您生成图片。后续我将继续完成大纲内容。

---
## 第一章：上海城市概况
- 地理位置：上海地处中国东部、长江入海口，是长江三角洲冲积平原的一部分。
- 行政区域：介绍上海下辖的行政区数量及主要区域划分。
- 人口：说明上海庞大的常住人口数量以及人口的多元性。
很遗憾，再次尝试生成图片时因文本风险未通过审核，无法获取图片。我会继续完成大纲内容。

---
## 第二章：上海历史文化
- 发展脉络：简述上海从一个小渔村逐渐发展成为国际化大都市的历程。
- 代表性历史建筑、文化遗址：如外滩的万国建筑博览群、豫园等，介绍其历史背景和文化价值。
### 第二章：上海历史文化
- 发展脉络：简述上海从一个小渔村逐渐发展成为国际化大都市的历程。
- 代表性历史建筑、文化遗址：如外滩的万国建筑博览群、豫园等，介绍其历史背景和文化价值。

![上海外滩万国建筑博览群](https://lf-bot-studio-plugin-resource.coze.cn/obj/bot-studio-platform-plugin-tos/artist/image/0e65322caf074c008ade9b8849410a00.png)

---
## 第三章：上海经济地位
- 国内乃至全球的经济影响力：说明上海是中国的经济中心，在全球金融、贸易等领域也具有重要地位。
- 标志性的商务区、金融中心：如陆家嘴金融贸易区，介绍其高楼林立的现代化景象和众多知名金融机构。
### 第三章：上海经济地位
- 国内乃至全球的经济影响力：说明上海是中国的经济中心，在全球金融、贸易等领域也具有重要地位。
- 标志性的商务区、金融中心：如陆家嘴金融贸易区，介绍其高楼林立的现代化景象和众多知名金融机构。

![上海陆家嘴金融贸易区夜景](https://lf-bot-studio-plugin-resource.coze.cn/obj/bot-studio-platform-plugin-tos/artist/image/38e2f984132b4cea81df9e299497e073.png)

---
## 第四章：上海城市风貌
- 现代化城市景观：介绍上海的高楼大厦，如上海中心大厦、东方明珠等，展现其现代建筑的魅力。
- 特色街区：提及田子坊、南京路步行街等，说明其独特的商业氛围和文化特色。
- 美丽自然景观：介绍上海的公园、湿地等自然景观，如世纪公园、东滩湿地等。
### 第四章：上海城市风貌
- 现代化城市景观：介绍上海的高楼大厦，如上海中心大厦、东方明珠等，展现其现代建筑的魅力。
- 特色街区：提及田子坊、南京路步行街等，说明其独特的商业氛围和文化特色。
- 美丽自然景观：介绍上海的公园、湿地等自然景观，如世纪公园、东滩湿地等。

![上海东方明珠与周边高楼大厦](https://lf-bot-studio-plugin-resource.coze.cn/obj/bot-studio-platform-plugin-tos/artist/image/b941660cc7d64546abf9d936dbc40a5b.png)

---
## 第五章：上海特色美食
- 经典美食列举：详细介绍小笼包、生煎包、蟹壳黄等上海经典美食的特点和制作工艺。
- 独特饮食文化：说明上海饮食文化融合了各地特色，又有自身独特风格。
### 第五章：上海特色美食
- 经典美食列举：详细介绍小笼包、生煎包、蟹壳黄等上海经典美食的特点和制作工艺。
- 独特饮食文化：说明上海饮食文化融合了各地特色，又有自身独特风格。

![上海小笼包、生煎包和蟹壳黄摆放在一起](https://lf-bot-studio-plugin-resource.coze.cn/obj/bot-studio-platform-plugin-tos/artist/image/5f32688108a845db898e585faadb981a.png)

---
## 第六章：上海娱乐休闲
- 丰富娱乐场所介绍：介绍上海的主题公园，如上海迪士尼乐园；剧院，如上海大剧院；博物馆，如上海博物馆等。
- 文化活动体验：提及上海经常举办的音乐会、艺术展览等文化活动。
### 第六章：上海娱乐休闲
- 丰富娱乐场所介绍：介绍上海的主题公园，如上海迪士尼乐园；剧院，如上海大剧院；博物馆，如上海博物馆等。
- 文化活动体验：提及上海经常举办的音乐会、艺术展览等文化活动。

![上海迪士尼乐园城堡](https://lf-bot-studio-plugin-resource.coze.cn/obj/bot-studio-platform-plugin-tos/artist/image/00d5e4d1a8c44a8cb25d284e2a7f8ec7.png)

---
## 第七章：上海国际影响
- 举办的国际活动、赛事：列举上海举办的进博会、F1中国大奖赛等国际活动和赛事。
- 国际化大都市地位体现：说明这些活动对上海提升国际知名度和影响力的作用。
### 第七章：上海国际影响
- 举办的国际活动、赛事：列举上海举办的进博会、F1中国大奖赛等国际活动和赛事。
- 国际化大都市地位体现：说明这些活动对上海提升国际知名度和影响力的作用。

![上海进博会场馆外观](https://lf-bot-studio-plugin-resource.coze.cn/obj/bot-studio-platform-plugin-tos/artist/image/e66c004d86e94aee956607184b928b74.png)

---
## 第八章：总结升华
- 整体特点概括：总结上海兼具历史文化底蕴与现代繁华、经济发达、文化多元、国际影响力大等特点。
- 赞美与展望：表达对上海这座城市的赞美之情，并展望上海未来更加辉煌的发展。
---
## 互动环节
- 提问与答疑：解答观众在讲座中提出的关于上海的各种问题。
- 分组讨论：讨论“如果有机会去上海，最想体验的事情”，引导观众深入思考上海的魅力。
---
## 结束语
- 重要性的再次强调：再次强调了解上海对于个人认知和发展的重要意义。
- 鼓励探索：鼓励观众有机会亲自去上海感受其独特魅力。  `;

    let index = 0;
    const interval = setInterval(() => {
      if (index < mockOutline.length) {
        setOutline(prev => prev + mockOutline[index]);
        index++;
      } else {
        setIsStreaming(false);
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [topic]);

  return (
    <div className="outline-stream">
      <div className="outline-stream__container">
        <div className="outline-stream__header">
          <h1 className="outline-stream__title">
            演示大纲生成中...
          </h1>
          {tags.length > 0 && (
            <div className="outline-stream__tags">
              {tags.map(tag => (
                <span key={tag} className="outline-stream__tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="outline-stream__content">
          {outline}
          {isStreaming && (
            <span className="outline-stream__cursor" />
          )}
        </div>

        <div className="outline-stream__actions">
          <button
            onClick={onBack}
            className="outline-stream__button outline-stream__button--back"
          >
            返回修改
          </button>
          <button
            onClick={() => onConfirm(outline)}
            disabled={isStreaming}
            className="outline-stream__button outline-stream__button--confirm"
          >
            {isStreaming ? '生成中...' : '确认并生成幻灯片'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OutlineStream;