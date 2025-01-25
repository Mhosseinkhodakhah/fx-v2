export interface storyEvent {

    user: {
        username: string,
        userId: string,
        profile: string,
    }

    mainId : string

    url: string

    seenStory: string[]

    likes : string[]

    typeStory: string

    activeStory: boolean
    
    deleted : boolean

}
