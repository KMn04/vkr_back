import express from "express";
import {WikiPage} from '../models/Wiki.mjs'

const router = express.Router();

const prepareWikiPage = (wikiPage) => ({
    wikiPageId: wikiPage._id,
    title: wikiPage.title,
    content: wikiPage.content
})

router.post('/:projectId/wiki', async (req, res) => {
    const projectId = req.params.projectId;

    const pageName = req.body.title;

    const newWikiPage = new WikiPage({
        projectId: projectId,
        title: pageName,
    })
    await newWikiPage.save();

    res.send(newWikiPage._id);
})

router.get("/:projectId/wiki", async (req, res) => {
    const projectId = req.params.projectId;

    const results = await WikiPage.find({projectId: projectId})
    const preparedResult = results.map(prepareWikiPage)
    res.send(preparedResult).status(200);
});

router.get('/:projectId/wiki/:wikiPageId', async (req, res) => {
    const {projectId, wikiPageId} = req.params;

    const tempWikiPage = await WikiPage.findOne({
        projectId: projectId, 
        _id: wikiPageId
    });
    
    if(tempWikiPage){
        res.send(prepareWikiPage(tempWikiPage));
        return;
    }
    res.status(400).send('Страница не найдена')
})

router.put('/:projectId/wiki/:wikiPageId', async (req, res) => {
    const {projectId, wikiPageId} = req.params;

    const tempWikiPage = await WikiPage.findOne({
        projectId: projectId, 
        _id: wikiPageId
    });

    if(!tempWikiPage){
        res.status(400).send('Страница не найдена')
        return;
    }

    const newTitle = req.body.title;
    const newContent = req.body.content;
    
    if(newTitle){
        tempWikiPage.title = newTitle;
    }
    if(newContent){
        tempWikiPage.content = newContent
    }

    await tempWikiPage.save();

    res.send(prepareWikiPage(tempWikiPage))
})

export default router