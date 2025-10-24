import React from 'react';
import './index.scss';

const SalesPage: React.FC = () => {
  return (
    <div className="sales-page">
      {/* 主标题区域 */}
      <section className="sales-page__hero">
        <h1 className="hero__title">拼多多版内容电商</h1>
        <p className="hero__subtitle">高顿教育千万级私域运营方案</p>
        <div className="hero__tags">
          <span className="tag">AI驱动</span>
          <span className="tag">数据决策</span>
          <span className="tag">智能运营</span>
        </div>
      </section>

      {/* 项目概述 */}
      <section className="sales-page__overview">
        <h2 className="section-title">项目概述</h2>
        <div className="overview__content">
          <div className="overview__item">
            {/* <img src="/icon-project.svg" alt="项目概述" className="overview__icon" /> */}
            <h3>项目名称：拼多多版内容电商</h3>
          </div>
          <div className="overview__item">
            <p className="overview__description">
              战略目标：<span className="highlight">向"高顿后"阶段的用户精准销售高价值内容知识产品，实现直接营收增长，让科技研发中心成为闭环生蛋的金鸡。</span>
            </p>
          </div>
        </div>

        <div className="overview__stats">
          <div className="stat-card">
            {/* <img src="/icon-users.svg" alt="用户规模" className="stat-icon" /> */}
            <div className="stat-content">
              <h4>核心规模</h4>
              <p>私域用户池 700-1000万人</p>
            </div>
          </div>
          <div className="stat-card">
            {/* <img src="/icon-users.svg" alt="用户画像" className="stat-icon" /> */}
            <div className="stat-content">
              <h4>运营理念</h4>
              <p>AI规模化、AI自动化"的现代AI模式，技术驱动，数据决策</p>
            </div>
          </div>
        </div>
      </section>

      {/* 高价值硬核产品 */}
      <section className="sales-page__products">
        <h2 className="section-title">高价值内容产品</h2>
        <p className="section-subtitle">高密度"干货"，即学即用的实战经验，1小时掌握别人半年积累的经验</p>

        <div className="products__grid">
          <div className="product-card">
            <img src="https://skyagent-artifacts.skywork.ai/page/fub647skqd/images/content_products_1.jpeg" alt="产品图" className="product-image" />
            <h3 className="product-title">《财务人员职业心得》</h3>
            <p className="product-desc">资深财务专家多年实战经验总结</p>
            <div className="product-price">¥9.9</div>
            <button className="btn-buy">热销</button>
          </div>

          <div className="product-card">
            <img src="https://skyagent-artifacts.skywork.ai/page/fub647skqd/images/content_products_2.webp" alt="产品图" className="product-image" />
            <h3 className="product-title">《AI赋能职业发展》</h3>
            <p className="product-desc">人工智能时代的职业规划与技能提升策略</p>
            <div className="product-price">¥9.9</div>
            <button className="btn-buy">AI</button>
          </div>

          <div className="product-card">
            <img src="https://skyagent-artifacts.skywork.ai/page/fub647skqd/images/content_products_3.jpeg" alt="产品图" className="product-image" />
            <h3 className="product-title">《段永平投资思路分析》</h3>
            <p className="product-desc">深度解析段永平投资哲学，学习价值投资精髓</p>
            <div className="product-price">¥9.9</div>
            <button className="btn-buy">投资</button>
          </div>
        </div>
      </section>

      {/* 核心产品竞争力 */}
      <section className="sales-page__advantages">
        <h2 className="section-title">核心产品实现路径</h2>

        <div className="advantages__list">
          <div className="advantage-item">
            <div className="advantage-icon">01</div>
            <div className="advantage-content">
              <h3>第一步：AI分析当前热点</h3>
              <p>解决了"卖什么"和"为什么现在卖"的问题，确保产品内容紧跟趋势，直击用户当下痛点和兴趣点。通过AI技术实时监测市场动态，精准捕捉用户需求变化。</p>
            </div>
          </div>

          <div className="advantage-item">
            <div className="advantage-icon">02</div>
            <div className="advantage-content">
              <h3>第二步：生产"高价值内容"</h3>
              <p>成为行业"信息雷达"。提供前沿、深度的行业洞察，满足用户的信息差需求。通过AI整理发布《科技发展趋势与岗位解析、实操案例》等高质量付费报告（PPT形式）。《AI赋能项目管理：职业发展》、《2025项目管理sop》。宣传口号："1小时掌握别人半年积累的经验"、"不用啃书，50页PPT看懂核心框架"。</p>
            </div>
          </div>

          <div className="advantage-item">
            <div className="advantage-icon">03</div>
            <div className="advantage-content">
              <h3>第三步：根据标签匹配用户需求</h3>
              <p>解决了"卖给谁"和"怎么卖"的问题，通过数据驱动实现"在合适的时间、用合适的渠道、将合适的内容推荐给合适的人"。首先，需构建一个立体的用户标签体系，这是精准匹配的基础。标签应包含：静态属性标签（年龄、职业、专业、所在城市）、动态行为标签（浏览、搜索过什么关键词、观看直播的时长）、兴趣需求标签（对"AI"、"求职"、"金融"、"软技能"等领域的兴趣度）。</p>
            </div>
          </div>

          <div className="advantage-item">
            <div className="advantage-icon">04</div>
            <div className="advantage-content">
              <h3>第四步：私域售卖9.9、69、199</h3>
              <p>通过AI规模化、AI自动化的现代模式，技术驱动，数据决策。在私域用户池中实现精准营销和销售转化。</p>
            </div>
          </div>
        </div>
      </section>

      {/* 查询成本 */}
      <section className="sales-page__pricing">
        <h2 className="section-title">营收测算</h2>
        <span>会员订阅费 + 单次销售 + 高端服务1v1</span>

        <table className="pricing-table">
          <thead>
            <tr>
              <th>运营来源</th>
              <th>测算公式</th>
              <th>年度收入</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>单次销售</td>
              <td>付费用户数（2%） × 客单价（20元） × 50</td>
              <td>2800万</td>
            </tr>
            <tr>
              <td>会员订阅</td>
              <td>会员数（1.5%） × 年费（399元）</td>
              <td>4200万</td>
            </tr>
            <tr>
              <td>总计</td>
              <td>刚好覆盖科研成本</td>
              <td>约7000万</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* 2项明确主链接购买拼多多版闪客电商AI链程 */}
      <section className="sales-page__offers">
        <h2 className="section-title">2.0阶段：围绕主题构建的"拼多多版内容电商"小程序</h2>
        
        <div className="offers__highlight">
          <p className="highlight-text">2.1 从"货架"到"智能知识服务中心"</p>
          <p className="sub-text">拼多多版内容电商",用户是买家，高顿是卖家。</p>
        </div>

        <div className="offers__details">
          <h3>2.2 核心功能设计：聚焦转化与粘性</h3>
          
          <div className="offer-cards">
            <div className="offer-card">
              <div className="offer-icon">01</div>
              <div className="offer-content">
                <h4>个性化首页</h4>
                <p>根据用户标签（职业、兴趣）展示不同商品</p>
              </div>
            </div>

            <div className="offer-card">
              <div className="offer-icon">02</div>
              <div className="offer-content">
                <h4>智能推荐系统</h4>
                <p>AI分析用户行为，精准推荐相关内容</p>
              </div>
            </div>

            <div className="offer-card">
              <div className="offer-icon">03</div>
              <div className="offer-content">
                <h4>会员订阅体系</h4>
                <p>多层级会员权益，提升用户粘性和长期价值</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 队入与团队 */}
      <section className="sales-page__team">
        <h2 className="section-title">投入与团队</h2>
        
        <div className="team-info">
          <p>团队配置（最小可行团队）：产品经理（1人）+ 前端/后端开发（2-3人）+ 运营（2人）+ 设计（1人）</p>
          <p>开发周期：2-个月</p>
        </div>
      </section>

      {/* 组装问题 */}
      <section className="sales-page__faq">
        <h2 className="section-title">相关问题</h2>

        <div className="faq-list">
          <div className="faq-item">
            <h3>我为啥要买？</h3>
            <p><strong>1. 精准高效，直击痛点：</strong>为您筛选出最值得投入时间的学习材料，极大节省了您的筛选成本。</p>
            <p><strong>2. 高密度"干货"，即学即用：</strong>把专家经验"打包"带回家。它将散落的知识点、复杂的工作流和宝贵的实战经验，转化为结构清晰、图表化的"操作手册"或"决策参考"。您获得的不是泛泛而谈的理论，而是可以立即应用于工作汇报、项目策划、面试备考的实用模板和结构化思路，学习效率和转化率极高。</p>
            <p><strong>3. 极致性价比，投资自我的最佳方式：</strong>相比动辄数千元的线下课程或咨询服务，几十到几百元的PPT资料能以极低的成本。是一套高性价比的"个人成长解决方案"。</p>
          </div>

          <div className="faq-item">
            <h3>为啥是"高顿后"用户？</h3>
            <div className="faq-steps">
              <p>1. 与现有业务不打架</p>
              <p>2. 用户更成熟</p>
              <p>3. 主要针对在职人士</p>
            </div>
          </div>

          <div className="faq-item">
            <h3>能卖的出去吗？</h3>
            <p>有很多小的竞品公司，即使是他们用户很不精准，也有上千万的收入。</p>
          </div>
        </div>
      </section>

      {/* 底部声明 */}
      <section className="sales-page__disclaimer">
        <p style={{color: '#fff', fontSize: 18, fontWeight: 600}} className="disclaimer-text">
          "拼多多版内容电商"计划不是一个简单的销售项目，而是一次用互联网产品和数据驱动思维，对高顿现有流量进行深度变现的战略升级。通过将无形的知识服务转化为标准化的高价值PPT产品，并在700万的私域池中实现精准匹配，高顿不仅能开辟一个年营收数千万乃至上亿的新业务线，更能将私域池打造成一个极具价值的数字资产，为公司的长期增长注入强大动力。
        </p>
      </section>

      {/* 底部版权信息 */}
      <footer className="sales-page__footer">
        <p>高顿教育内容电商方案</p>
        <p>2025 高顿教育. 技术方案文档</p>
      </footer>
    </div>
  );
};

export default SalesPage;