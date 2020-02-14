<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <el-tag type="info">excel模版说明</el-tag>
        <el-tag>
          <i class="el-icon-download" />
          <a
            :href="'https://ty-edu1.oss-cn-beijing.aliyuncs.com/%E6%A8%A1%E6%9D%BF/test.xlsx'"
          >点击下载模版</a>
        </el-tag>
      </el-form-item>

      <el-form-item label="选择Excel">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="importBtnDisabled"
          :limit="1"
          :action="'http://localhost:8001/school_eduservice/edu-subject/import'"
          name="file"
          accept="application/vnd.ms-excel"
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button
            :loading="loading"
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload"
          >{{ fileUploadBtnText }}</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileUploadBtnText: "上传到服务器", // 按钮文字
      importBtnDisabled: false, // 按钮是否禁用,
      loading: false
    };
  },
  created() {},
  methods: {
    //提交表单
    submitUpload() {
      this.fileUploadBtnText = "正在上传";
      this.importBtnDisabled = true;
      this.loading = true;
      this.$refs.upload.submit();
    },
    //上传成功
    fileUploadSuccess(response) {
      if (response.success === true) {
        this.fileUploadBtnText = "导入成功";
        this.loading = false;
        this.$message({
          type: "success",
          message: "成功！"
        });
      } else {
        this.fileUploadBtnText = "导入失败";
        this.loading = false;
        const messages = response.data.msgList;
        let msgString = "<ul>";
        messages.forEach(msg => {
          msgString += `<li>${msg}</li>`;
        });
        msgString += "</ul>";
        this.$alert(msgString, response.message, {
          dangerouslyUseHTMLString: true
        });
      }
    },
    //上传失败
    fileUploadError() {
      this.fileUploadBtnText = "导入失败";
      this.loading = false;
      this.$message({
        type: "error",
        message: "导入失败"
      });
    }
  }
};
</script>