<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name" />
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" min="0" />
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师" />
          <el-option :value="2" label="首席讲师" />
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career" />
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea" />
      </el-form-item>

      <!-- 讲师头像：TODO -->
      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">
        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar" />
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像</el-button>

        <!--
          v-show：是否显示上传组件
          :key：类似于id，如果一个页面多个图片上传控件，可以做区分
          :url：后台上传的url地址
          @close：关闭上传组件
        @crop-upload-success：上传成功后的回调-->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="'http://localhost:8001/school_eduservice/oss/upload'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"
        />
      </el-form-item>
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
import teacherApi from "@/api/teacher";
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
export default {
  //声明要使用的组件
  components: {ImageCropper, PanThumb},
  data() {
    return {
      teacher: {
        name: "",
        sort: 0,
        level: "",
        career: "",
        intro: "",
        avatar: ""
      },
      // BASE_API: process.env.BASE_API, // 接口API地址
      saveBtnDisabled: false,
      imagecropperShow: false, // 是否显示上传组件
      imagecropperKey: 0 // 上传组件id
    };
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      const id = this.$route.params.id;
      this.getTeacherByid(id);
    }
  },
  methods: {
    saveOrUpdate() {
      this.saveBtnDisabled = true;
      if (!this.teacher.id) {
        this.saveData();
      } else {
        this.updateTeacher();
      }
    },
    cropSuccess(data) {
      console.log(data);
      this.imagecropperShow = false;
      this.teacher.avatar = data.imgurl;
      // 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
      this.imagecropperKey = this.imagecropperKey + 1;
    },

    // 关闭上传组件
    close() {
      this.imagecropperShow = false;
      // 上传失败后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
      this.imagecropperKey = this.imagecropperKey + 1;
    },
    //根据id查询
    getTeacherByid(id) {
      teacherApi
        .getTeacherById(id)
        .then(response => {
          this.teacher = response.data.teachers;
        })
        .catch(() => {
          return this.$message({
            type: "error",
            message: "查找失败!"
          });
        });
    },
    //实现后台接口实现添加操作
    saveData() {
      teacherApi
        .saveTeacher(this.teacher)
        .then(() => {
          //成功添加后提示用户
          return this.$message({
            type: "success",
            message: "添加成功!"
          });
        })
        .then(() => {
          //回到页面之中
          //通过路由跳转
          this.$router.push({ path: "/teacher" });
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "添加失败"
          });
        });
    },
    updateTeacher() {
      teacherApi
        .updateTeacherById(this.teacher.id, this.teacher)
        .then(() => {
          //成功修改后提示用户
          return this.$message({
            type: "success",
            message: "修改成功!"
          });
        })
        .then(() => {
          //回到页面之中
          //通过路由跳转
          this.$router.push({ path: "/teacher" });
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "修改失败"
          });
        });
    }
  }
};
</script>