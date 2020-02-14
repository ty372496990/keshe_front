<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="提交审核" />
    </el-steps>
    <el-button type="text" @click="openAddChapter">添加章节</el-button>
    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title" />
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" :min="0" controls-position="right" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title" />
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.isFree">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <!-- TODO -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 章节 -->
    <ul class="chanpterList">
      <li v-for="chapter in chapterNestedList" :key="chapter.id">
        <p>
          {{ chapter.title }}
          <span class="acts">
            <el-button type="text" @click="openVideo(chapter.id)">添加课时</el-button>
            <el-button type="text" @click="editChapter(chapter.id)">编辑</el-button>
            <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
          </span>
        </p>

        <!-- 视频 -->
        <ul class="chanpterList videoList">
          <li v-for="video in chapter.children" :key="video.id">
            <p>
              {{ video.title }}
              <span class="acts">
                <el-button type="text" @click="editVideo(video.id)">编辑</el-button>
                <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <el-form label-width="120px">
      <el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
import chapter from "@/api/chapter";
import video from "@/api/video";
export default {
  data() {
    return {
      id: "",
      chapterNestedList: [], // 章节嵌套视频列表
      dialogChapterFormVisible: false, //是否显示章节表单
      dialogVideoFormVisible: false, //是否显示小节表单
      chapterId: '', // 课时所在的章节id
      chapter: {
        // 章节对象
        title: "",
        sort: 0,
        chapterId: ""
      },
      video: {
        // 章节对象
        title: "",
        sort: 0,
        free: 0,
        videoSourceId: ""
      }
    };
  },
  created() {
    this.init();
  },
  methods: {
    removeVideo(videoId) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return video.removeById(videoId);
        })
        .then(() => {
          this.getChapterListByCourseId(); // 刷新列表
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(response => {
          // 失败
          if (response === "cancel") {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          }
        });
    },
    //编辑小节
    editVideo(videoId) {
      this.dialogVideoFormVisible = true;
      video.getVideoInfoById(videoId).then(response => {
        this.video = response.data.eduVideo;
      });
    },
    openVideo(chapterId) {
      this.dialogVideoFormVisible = true;
      this.chapterId = chapterId;
    },
    //打开添加修改对话框时的初始化
    openAddChapter() {
      this.dialogChapterFormVisible = true;
      (this.chapter.title = ""),
        (this.chapter.sort = 0),
        (this.chapter.courseId = "");
    },
    //编辑章节信息
    editChapter(chapterId) {
      this.dialogChapterFormVisible = true;
      chapter.getById(chapterId).then(response => {
        this.chapter = response.data.eduChapter;
      });
    },
    init() {
      if (this.$route.params && this.$route.params.id) {
        this.id = this.$route.params.id;
        console.log(this.id);
        //查询数据回显
        this.getChapterListByCourseId();
      }
    },
    getChapterListByCourseId() {
      chapter.getChapterTreeList(this.id).then(response => {
        this.chapterNestedList = response.data.items;
      });
    },
    previous() {
      this.$router.push({ path: "/course/info/" + this.id });
    },
    next() {
      this.$router.push({ path: "/course/publish/"+ this.id});
    },
    saveOrUpdateVideo() {
      this.saveVideoBtnDisabled = true
      if (!this.video.id) {
        this.saveDataVideo();
      } else {
        this.updateDataVideo();
      }
    },
    saveDataVideo() {
      this.video.courseId = this.id;
      this.video.chapterId = this.chapterId;
      video.saveVideoInfo(this.video).then(response => {
        this.$message({
          type: "success",
          message: "保存成功!"
        });
        this.helpSaveVideo();
      });
    },
    updateDataVideo() {
      video.updateVideoInfoById(this.video).then(response => {
        this.$message({
          type: "success",
          message: "修改成功!"
        });
        this.helpSaveVideo();
      });
    },
    saveOrUpdate() {
      this.saveBtnDisabled = true;
      if (!this.chapter.id) {
        this.saveData();
      } else {
        this.updateData();
      }
    },
    //删除章节
    removeChapter(chapterId) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return chapter.removeById(chapterId);
        })
        .then(() => {
          this.getChapterListByCourseId(); // 刷新列表
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(response => {
          // 失败
          if (response === "cancel") {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          } else {
            this.$message({
              type: "error",
              message: response.message
            });
          }
        });
    },
    //增加章节
    saveData() {
      this.chapter.courseId = this.id;
      chapter
        .save(this.chapter)
        .then(response => {
          this.$message({
            type: "success",
            message: "保存成功!"
          });
          this.helpSave();
        })
        .catch(response => {
          this.$message({
            type: "error",
            message: response.message
          });
        });
    },
    //更新章节
    updateData() {
      chapter
        .updateById(this.chapter)
        .then(response => {
          this.$message({
            type: "success",
            message: "修改成功!"
          });
          this.helpSave();
        })
        .catch(response => {
          // console.log(response)
          this.$message({
            type: "error",
            message: response.message
          });
        });
    },

    helpSave() {
      this.dialogChapterFormVisible = false; // 如果保存成功则关闭对话框
      this.getChapterListByCourseId(); // 刷新列表
      this.chapter.title = ""; // 重置章节标题
      this.chapter.sort = 0; // 重置章节标题
      this.saveBtnDisabled = false;
    },
    helpSaveVideo() {
      this.dialogVideoFormVisible = false; // 如果保存成功则关闭对话框
      this.getChapterListByCourseId(); // 刷新列表
      this.video.title = ""; // 重置章节标题
      this.video.sort = 0; // 重置章节标题
      this.video.videoSourceId = ""; // 重置视频资源id
      this.saveVideoBtnDisabled = false;
    }
  }
};
</script>

<style scoped>
.chanpterList {
  position: relative;
  margin: 0;
  padding: 0;
}
.chanpterList li {
  position: relative;
}
.chanpterList p {
  /* float: left; */
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #ddd;
}
.chanpterList .acts {
  float: right;
  font-size: 14px;
}

.videoList {
  padding-left: 50px;
}
.videoList p {
  /* float: left; */
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #ddd;
}
</style>