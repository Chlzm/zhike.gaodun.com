// @ts-nocheck
import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

interface OutlineStreamProps {
  topic: string;
  onConfirm: (outline: string) => void;
  onBack: () => void;
}

const OutlineStream = ({ topic, onConfirm, onBack }: OutlineStreamProps) => {
  const [outline, setOutline] = useState(``);
  const [isStreaming, setIsStreaming] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  // 默认markdown内容
  const defaultMarkdown = `
## 职业综合能力提升——通往职场成功之路
- 本页面旨在助力职场人士全方位提升核心能力，涵盖沟通、团队协作、领导力等多个方面。在当今快速变化的商业环境中，新的技能需求不断涌现，职场人士面临着巨大的挑战。通过提升职业综合能力，能够更好地适应市场变化，增强自身在职场中的竞争力，为个人的职业发展打下坚实基础。
![职业综合能力提升](https://lf-bot-studio-plugin-resource.coze.cn/obj/bot-studio-platform-plugin-tos/artist/image/396d20acc5684ef787cfc3f80befc570.png)
---
## 职场能力现状洞察
- 为了深入了解职场能力现状，我们通过多种途径收集数据。借助专业职场调研机构报告、企业招聘网站大数据分析以及职场人士问卷调查，获取了丰富的信息。例如，通过分析近五年职场技能需求变化趋势，我们发现某些新兴技能的需求呈显著增长态势，而一些传统技能的需求则有所下降。不同年龄段职场人士对自身能力短板的认知也存在差异。
![近五年职场技能需求变化趋势](https://quickchart.io/chart/render/zf-c8c860af-737e-4918-bc2f-8a6a970d6f4c)
---
## 核心要素与重要性解析
- 从专业人力资源管理书籍、行业专家观点以及企业内部培训资料中，我们确定了职场综合能力的核心要素，包括沟通能力、团队协作能力、领导力、学习能力等。沟通能力有助于信息的有效传递，促进团队协作；团队协作能力能使成员之间优势互补，提高工作效率；领导力则在带领团队达成目标中发挥关键作用；学习能力是适应不断变化的职场环境的基础。
![核心要素重要性对比](https://quickchart.io/chart/render/zf-3109bb36-ae61-4326-a9fe-ecb66a448923)
---
## 能力提升量化呈现
- 收集关于职场能力提升的数据，如参加培训后员工绩效提升的百分比、掌握新技能后薪资增长幅度等。通过对比参加培训和未参加培训的员工绩效提升情况，我们可以直观地看到能力提升对个人和企业的积极影响。参加培训的员工在工作效率、工作质量等方面往往有更明显的提升，这也为企业带来了更高的效益。
由于生成柱状图时出现错误，暂时无法为您展示相关图表。不过，我们可以想象一个柱状图，其中一组柱子代表参加培训员工，另一组代表未参加培训员工，柱子高度表示绩效提升的具体数值。从数据来看，参加培训员工绩效提升幅度明显高于未参加培训员工，这充分说明了能力提升对个人和企业的积极影响。
---
## 各行业评估标准概览
- 深入研究不同行业（如金融、科技、制造业等）的职场能力评估标准和关键指标。通过行业协会报告、企业招聘要求、专业研究论文等获取信息。不同行业在能力评估方面存在共性与差异，例如沟通能力、团队协作能力在各行业都较为重要，但在金融行业，风险评估能力更为关键；在科技行业，创新能力和技术应用能力的权重较大。
|行业|沟通能力|团队协作能力|领导力|学习能力|风险评估能力|创新能力|技术应用能力|


注：以上数据仅为示例，用于展示不同行业能力评估指标的权重差异。
---
## 实用提升方法与案例分享
- 收集各种职场能力提升方法，如参加培训课程、实践项目锻炼、导师辅导等，并整理与之相关的成功案例。参加培训课程可以系统地学习专业知识和技能；实践项目锻炼能让职场人士在实际操作中积累经验，提升解决问题的能力；导师辅导则可以获得专业的指导和建议，少走弯路。
![职场能力提升方法流程图表](https://lf-bot-studio-plugin-resource.coze.cn/obj/bot-studio-platform-plugin-tos/artist/image/443ef6e7bb2a45698b81cf75a671ea9c.png)
---
## 总结与展望
- 总结职业综合能力提升的关键要点，包括了解职场能力现状、明确核心要素及其重要性、量化能力提升效果、掌握各行业评估标准以及运用实用提升方法等。对未来职场能力发展趋势进行展望，随着科技的不断进步和社会的发展，职场对能力的要求也将不断变化，持续提升职业综合能力将变得尤为重要。
![职业综合能力提升总结与展望思维导图](https://lf-bot-studio-plugin-resource.coze.cn/obj/bot-studio-platform-plugin-tos/artist/image/6de12a8ae9d54294915c801ba61cd12a.png)`;

  // F5键监听
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'p') {
        event.preventDefault();
        setIsStreaming(false);
        setOutline(defaultMarkdown);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [defaultMarkdown]);

  // 真实API流式调用
  useEffect(() => {
    callRealStreamingAPI();
  }, [topic]);


  // 真实API流式调用
  const callRealStreamingAPI = async () => {
    try {
      setIsStreaming(true);
      setOutline('');

      const response = await fetch('https://api.coze.cn/v1/workflow/stream_run', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer pat_Ixb05xOh3D8wmdKr8ehv1PDohbtpmLFD8LJgJI3s5aMb1vGGBxhb77jfDje6QyDg',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          workflow_id: '7563227177929637903',
          parameters: {
            keyword: topic,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('ReadableStream not supported');
      }

      const decoder = new TextDecoder('utf-8');
      let accumulated = ''; // 累积的 Markdown 内容
      let buffer = '';      // SSE 数据缓冲区
      let lastUpdateTime = Date.now();

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          console.log('Stream complete');
          console.log('Final markdown:', accumulated);
          setIsStreaming(false);
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        // 按行处理 SSE 数据
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // 保留最后一行（可能不完整）

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonStr = line.substring(6); // 去掉 "data: " 前缀
              const data = JSON.parse(jsonStr);

              // 提取 content 字段并累积
              if (data.content) {
                accumulated += data.content;
              }
            } catch (e) {
              console.warn('Failed to parse SSE data:', line);
            }
          }
        }

        // 限制更新频率，避免过度渲染
        const now = Date.now();
        if (now - lastUpdateTime > 100) {  // 每100ms更新一次界面
          setOutline(accumulated);
          lastUpdateTime = now;
          // 自动滚动到底部
          setTimeout(() => {
            if (contentRef.current) {
              contentRef.current.scrollTop = contentRef.current.scrollHeight;
            }
          }, 10);
        }
      }

      // 确保最后一次更新
      setOutline(accumulated);
      // 最终滚动到底部
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.scrollTop = contentRef.current.scrollHeight;
        }
      }, 10);
    } catch (error) {
      console.error('API调用失败:', error);
      setIsStreaming(false);
      setOutline('生成大纲失败，请重试');
    }
  };


  return (
    <div className="outline-stream">

      <div className="outline-stream__container">
        <div className="outline-stream__header">
          {isStreaming ? '内容生成中...' : '大纲'}
        </div>

        <div className="outline-stream__content" ref={contentRef}>
          <ReactMarkdown>{outline}</ReactMarkdown>
          {isStreaming && (
            <span className="outline-stream__cursor" />
          )}
        </div>

        <div className="outline-stream__actions">

          <div
            onClick={onBack}
            style={{ 
              opacity: isStreaming ? 0.4 : 1,
              pointerEvents: isStreaming ? 'none' : 'auto',
              cursor: isStreaming ? 'default' : 'pointer'
            }}
          >
            返回修改
          </div>
          <div
            style={{ 
              opacity: isStreaming ? 0.4 : 1,
              pointerEvents: isStreaming ? 'none' : 'auto',
              cursor: isStreaming ? 'default' : 'pointer'
            }}
            onClick={() => onConfirm(outline)}
          >
            确认生成幻灯片
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutlineStream;