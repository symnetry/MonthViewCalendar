/**
 * 黑金风格 loading 占位
 * 解决首次加载时白屏的问题
 */
(function () {
  const _root = document.querySelector('#root');
  if (_root && _root.innerHTML === '') {
    _root.innerHTML = `
      <style>
        html,
        body,
        #root {
          height: 100%;
          margin: 0;
          padding: 0;
          background: #000000;
        }
        #root {
          background-repeat: no-repeat;
          background-size: 100% auto;
        }

        .loading-title {
          font-size: 1.1rem;
          color: #D4AF37;
          font-weight: 600;
          text-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
          margin-bottom: 8px;
        }

        .loading-sub-title {
          margin-top: 12px;
          font-size: 0.9rem;
          color: #8B7355;
          text-shadow: 0 0 5px rgba(139, 115, 85, 0.3);
        }

        .page-loading-warp {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 26px;
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          min-height: 362px;
          background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
          position: relative;
          overflow: hidden;
        }

        .loading-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #D4AF37, transparent);
          animation: shimmer 2s infinite;
        }

        .ant-spin {
          position: absolute;
          display: none;
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          color: #D4AF37;
          font-size: 14px;
          font-variant: tabular-nums;
          line-height: 1.5;
          text-align: center;
          list-style: none;
          opacity: 0;
          transition: transform 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
          font-feature-settings: "tnum";
        }

        .ant-spin-spinning {
          position: static;
          display: inline-block;
          opacity: 1;
        }

        .ant-spin-dot {
          position: relative;
          display: inline-block;
          width: 24px;
          height: 24px;
          font-size: 24px;
        }

        .ant-spin-dot-item {
          position: absolute;
          display: block;
          width: 10px;
          height: 10px;
          background: linear-gradient(45deg, #D4AF37, #FFD700);
          border-radius: 50%;
          transform: scale(0.75);
          transform-origin: 50% 50%;
          opacity: 0.8;
          box-shadow: 0 0 8px rgba(212, 175, 55, 0.6);
          animation: antSpinMove 1s infinite linear alternate;
        }

        .ant-spin-dot-item:nth-child(1) {
          top: 0;
          left: 0;
          background: linear-gradient(45deg, #D4AF37, #B8860B);
        }

        .ant-spin-dot-item:nth-child(2) {
          top: 0;
          right: 0;
          background: linear-gradient(45deg, #FFD700, #D4AF37);
          animation-delay: 0.3s;
        }

        .ant-spin-dot-item:nth-child(3) {
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, #B8860B, #FFD700);
          animation-delay: 0.6s;
        }

        .ant-spin-dot-item:nth-child(4) {
          bottom: 0;
          left: 0;
          background: linear-gradient(45deg, #FFD700, #B8860B);
          animation-delay: 0.9s;
        }

        .ant-spin-dot-spin {
          transform: rotate(45deg);
          animation: antRotate 1.2s infinite linear;
        }

        .ant-spin-lg .ant-spin-dot {
          width: 36px;
          height: 36px;
          font-size: 36px;
        }

        .ant-spin-lg .ant-spin-dot i {
          width: 16px;
          height: 16px;
        }

        @keyframes antSpinMove {
          0% {
            opacity: 0.6;
            transform: scale(0.75);
          }
          100% {
            opacity: 1;
            transform: scale(1);
            box-shadow: 0 0 12px rgba(212, 175, 55, 0.8);
          }
        }

        @keyframes antRotate {
          to {
            transform: rotate(405deg);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .gold-line {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, 
            transparent 0%, 
            #D4AF37 20%, 
            #FFD700 50%, 
            #D4AF37 80%, 
            transparent 100%);
          opacity: 0.7;
        }
      </style>

      <div class="loading-container">
        <div class="gold-line"></div>
        <div class="page-loading-warp">
          <div class="ant-spin ant-spin-lg ant-spin-spinning">
            <span class="ant-spin-dot ant-spin-dot-spin">
              <i class="ant-spin-dot-item"></i>
              <i class="ant-spin-dot-item"></i>
              <i class="ant-spin-dot-item"></i>
              <i class="ant-spin-dot-item"></i>
            </span>
          </div>
        </div>
        <div class="loading-title">
          正在加载资源
        </div>
        <div class="loading-sub-title">
          初次加载资源可能需要较多时间 请耐心等待
        </div>
      </div>
    `;
  }
})();