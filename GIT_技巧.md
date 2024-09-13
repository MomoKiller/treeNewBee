# 查看历史提交记录

```git
git log --stat
```

# git pull 强制覆盖本地文件

```git
$ git fetch --all
$ git reset --hard origin/master
$ git pull
```

# 添加 tag

```git
$ git tag -a v1.4 -m "my version 1.4"
```

# 删除本地分支

```git
git branch -D [branchname]
```

# 删除远程分支

```git
git push origin --delete [branchname]
```

# 隐藏当前修改的内容

```git
git stash save "msg"
```

# 查看 stsh 列表

```git
git stash list
```

# 使用 stash 内容

```git
git stash apply stash{0}
```

# 查看历史提交记录

```git
git log
```

# 简化历史记录

```git
git log --pretty=oneline
```

# remote

```git
git remote add origin <远程 Git 仓库地址>
```

# 切换分支

```git
git check -b [new branch]
```

## 等价于

```git
git branch [new branch]
git check [new branch]
```

# 使用兼容方式安装依赖

```git
npm i fibers@5.0.0 --ignore-scripts --legacy-peer-deps
```
