<template>
  <div>
    <div
        ref="referenceElement"
        @mouseenter="showPopover"
        @mouseleave="scheduleHidePopover"
    >
      <slot name="reference"></slot> <!-- 用于显示触发 Popover 的按钮 -->
    </div>

    <div
        v-if="isPopoverVisible"
        ref="popoverElement"
        class="popover-content"
        @mouseenter="cancelHidePopover"
        @mouseleave="scheduleHidePopover"
    >
      <slot></slot> <!-- 用于显示 Popover 的内容 -->
    </div>
  </div>
</template>

<script>
import { createPopper } from '@popperjs/core';

export default {
  name:'Popover',
  data() {
    return {
      isPopoverVisible: false,
      popperInstance: null,
      hideTimeout: null, // 用于控制隐藏计时器
    };
  },
  methods: {
    showPopover() {
      this.isPopoverVisible = true;
      this.$nextTick(() => {
        if (!this.popperInstance) {
          this.popperInstance = createPopper(this.$refs.referenceElement, this.$refs.popoverElement, {
            placement: 'bottom', // 你可以根据需要设置 popover 的位置
          });
        }
      });
    },
    hidePopover() {
      this.isPopoverVisible = false;
      if (this.popperInstance) {
        this.popperInstance.destroy();
        this.popperInstance = null;
      }
    },
    scheduleHidePopover() {
      this.hideTimeout = setTimeout(() => {
        this.hidePopover();
      }, 200); // 延迟隐藏，可以根据需要调整时间
    },
    cancelHidePopover() {
      if (this.hideTimeout) {
        clearTimeout(this.hideTimeout);
        this.hideTimeout = null;
      }
    }
  },
  beforeDestroy() {
    if (this.popperInstance) {
      this.popperInstance.destroy();
    }
  }
};
</script>

<style scoped>
.popover-content {
  background-color: white;
  border: 1px solid #ccc;
  padding: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  position: absolute;
}
</style>
