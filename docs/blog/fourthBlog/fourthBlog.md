```
**撤销git add** 

git reset HEAD 上一次add 里面的全部撤销

git reset HEAD xxxx.js 对某个文件进行撤销

**撤销git commit**
git reset --soft HEAD~1 撤销上一个版本commit

git reset --soft HEAD~2 撤销上两个版本commit
   --mixed：会影响到暂存区和历史记录区。也是默认选项
   --soft：只影响历史记录区
   --hard：影响工作区、暂存区和历史记录

git reset 是直接删除 commit 记录。

git revert 撤销某次操作，这个操作之前和之后的commit和history都会保留，并且把这次撤销

作为一次最新的提交
    git revert HEAD                  撤销上一个版本 commit
    git revert HEAD^               撤销上两个版本 commit
    git revert commit （比如：git revert c011eb3c20ba6fb38cc94fe5a8dda366a3990c61）撤销指定的版本，撤销也会作为一次提交进行保存。

git revert是提交一个新的版本，将需要revert的版本的内容再反向修改回去，版本会递增，不影响之前提交的内容

git stash  执行缓存,merge冲突时可以用一下

git stash save "message" 执行缓存时候添加备注

git stash pop 恢复缓存

git stash clear 删除所有缓存的git stash

git checkout -b dev(本地分支名称) origin/dev(远程分支名称)  拉取本地分支并切换到该分支

git reset --merge 取消合并

git branch 所有本地分支

git branch -r 所有远程分支

git branch -a 所有本地分支和远程分支

git branch -d [branch-name] 删除一个分支 git branch -d test

git push origin --delete [branch-name] 删除远程分支 git push origin --delete test

git log 

git reset –-soft <版本号> 撤销到某个版本  git reset --soft 4f5e9a90edeadcc45d85f43bd861a837fa7ce4c7 

git push origin 分支名 --force 强制提交当前分支

git push origin HEAD --force 强制提交

git rebase -i  commitId  多个commit合并

git rebase --abort 撤销

```
