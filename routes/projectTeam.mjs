// на проекте только 1 роль
// при смене роли либо менять роль либо удалять и делать новую, но наверно нахрен не нужно плодить столько

// Получение команды проекта


import router from "./projects.mjs";
import {ProjectTeamMember} from "../models/ProjectTeamMember.mjs";
import {User} from "../models/User.mjs";
import {Role} from "../models/Role.mjs";

router.get("/:projectId/members", async (req, res) => {
    const tempMembers = await ProjectTeamMember.findAll({
        where: {
            projectId: req.params.projectId,
            finishedAt: null,
        },
        include: [{
            model: User,
            attributes: ["firstName", "secondName", "login", "userId", "email"]
        }, Role],
    })
    const result = tempMembers.map((member) => {
        return {
            userId: member.dataValues.userId,
            user: member.dataValues.user.dataValues,
            roleCode: member.dataValues.roleCode,
            roleName: member.dataValues.role.dataValues.name
        }
    })
    res.send(result)
})

export default router