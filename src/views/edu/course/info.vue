<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="提交审核" />
    </el-steps>

    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写" />
      </el-form-item>

      <!-- 所属分类：级联下拉列表 -->
      <!-- 一级分类 -->
      <el-form-item label="课程类别">
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="请选择"
          @change="subjectLevelOneChanged"
        >
          <el-option
            v-for="subject in firstSubjectList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="请选择">
          <el-option
            v-for="subject in secondSubjectList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
      </el-form-item>

      <!-- 课程讲师 TODO -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="总课时">
        <el-input-number
          :min="0"
          v-model="courseInfo.lessonNum"
          controls-position="right"
          placeholder="请填写课程的总课时数"
        />
      </el-form-item>

      <!-- 课程简介 TODO -->
      <el-form-item label="课程简介">
        <!-- <el-input v-model="courseInfo.description" placeholder=" 示例：简介" /> -->
        <tinymce v-model="courseInfo.description" :height="300" />
      </el-form-item>
      <!-- 课程封面-->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="'http://localhost:8001/school_eduservice/oss/upload'"
          class="avatar-uploader"
        >
          <img :src="courseInfo.cover" />
        </el-upload>
      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number
          :min="0"
          v-model="courseInfo.price"
          controls-position="right"
          placeholder="免费课程请设置为0元"
        />元
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";
import course from "@/api/course";
import subject from "@/api/subject";
const defaultForm = {
  title: "",
  subjectId: "",
  teacherId: "",
  lessonNum: 0,
  description: "",
  cover: "https://ty-edu1.oss-cn-beijing.aliyuncs.com/jBTK43f.png",
  price: 0,
  subjectParentId: ""
};
export default {
  components: { Tinymce },
  data() {
    return {
      saveBtnDisabled: false,
      courseInfo: defaultForm,
      teacherList: [],
      firstSubjectList: [], //一级分类列表
      secondSubjectList: [] //二级分类列表
    };
  },
  created() {
    console.log("info created");
    this.init();
  },
  watch: {
    $route(to, from) {
      console.log("watch $route");
      this.init();
    }
  },
  methods: {
    //上传成功之后
    handleAvatarSuccess(res, file) {
      this.courseInfo.cover = res.data.imgurl;
    },
    //上传成功之前
    beforeAvatarUpload(file) {
      ////对图片大小做限制
      // const isJPG = file.type === "image/jpeg";
      // const isLt2M = file.size / 1024 / 1024 < 2;
      // if (!isJPG) {
      //   this.$message.error("上传头像图片只能是 JPG 格式!");
      // }
      // if (!isLt2M) {
      //   this.$message.error("上传头像图片大小不能超过 2MB!");
      // }
      // return isJPG && isLt2M;
    },
    //点击一级分类触发事件
    subjectLevelOneChanged(value) {
      console.log(value);
      for (let i = 0; i < this.firstSubjectList.length; i++) {
        if (this.firstSubjectList[i].id === value) {
          this.secondSubjectList = this.firstSubjectList[i].children;
          this.courseInfo.subjectId = "";
        }
      }
    },
    //获取所有分类信息
    getSubjectList() {
      subject
        .getNestedTreeList()
        .then(response => {
          this.firstSubjectList = response.data.items;
        })
        .catch(response => {
          this.$message({
            type: "error",
            message: response.message
          });
        });
    },
    //获取所有讲师
    getTeacherList() {
      course
        .getAllTeacherList()
        .then(response => {
          this.teacherList = response.data.items;
        })
        .catch(response => {
          this.$message({
            type: "error",
            message: response.message
          });
        });
    },
    getCourseById(id) {
      course
        .getAllCourseList(id)
        .then(response => {
          this.courseInfo = response.data.form;
          subject
            .getNestedTreeList()
            .then(response => {
              this.firstSubjectList = response.data.items;
              for (
                let index = 0;
                index < this.firstSubjectList.length;
                index++
              ) {
                const element = this.firstSubjectList[index];
                if (element.id === this.courseInfo.subjectParentId) {
                  this.secondSubjectList = element.children;
                }
              }
            })
            .catch(response => {
              this.$message({
                type: "error",
                message: response.message
              });
            });
        })
        .catch(response => {
          this.$message({
            type: "error",
            message: response.message
          });
        });

      this.getTeacherList();
    },
    init() {
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id;
        console.log(id);
        //查询数据回显
        this.getCourseById(id);
      } else {
        this.courseInfo = { ...defaultForm };
        this.getTeacherList();
        this.getSubjectList();
      }
    },
    //保存课程
    next() {
      console.log("next");
      this.saveBtnDisabled = true;
      if (!this.courseInfo.id) {
        this.saveData();
      } else {
        this.updateData();
      }
    },
    // 保存
    saveData() {
      course
        .addCourseInfo(this.courseInfo)
        .then(response => {
          this.$message({
            type: "success",
            message: "保存成功!"
          });
          return response; // 将响应结果传递给then
        })
        .then(response => {
          this.$router.push({
            path: "/course/chapter/" + response.data.courseid
          });
        })
        .catch(response => {
          this.$message({
            type: "error",
            message: response.message
          });
        });
    },
    updateData() {
      // this.$router.push({ path: "/course/chapter/1" });
        course
        .updateCourse(this.courseInfo)
        .then(response => {
          this.$message({
            type: "success",
            message: "修改成功!"
          });
          return response; // 将响应结果传递给then
        })
        .then(response => {
          this.$router.push({
            path: "/course/chapter/"+this.$route.params.id
          });
        })
        .catch(response => {
          this.$message({
            type: "error",
            message: response.message
          });
        });
    }
  }
};
</script>

<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>