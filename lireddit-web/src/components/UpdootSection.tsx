import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons"
import { Flex, IconButton } from "@chakra-ui/react"
import { useState } from "react"
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql"

interface UpdootSectionProps {
    post: PostSnippetFragment
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({post}) => {
    const [loadingState, setLoadingState,] = useState<'updoot-loading' | 'downdoot-loading' | 'not-loading'>('not-loading');
    const [vote] = useVoteMutation();
    return (
        <Flex
            direction='column'
            justifyContent='center'
            alignItems='center'
            mr={4}>
            <IconButton
                aria-label="updoot post"
                colorScheme={post.voteStatus === 1 ? "green" : undefined}
                icon={<ChevronUpIcon boxSize="24px"/>}
                onClick={async () => {
                    if (post.voteStatus === 1){
                        return;
                    }
                    setLoadingState("updoot-loading");
                    await vote ({ 
                        variables: {
                            postId: post.id,
                            value: 1
                        }
                    });
                    setLoadingState("not-loading");
                }}
                isLoading={loadingState === 'updoot-loading'}
                />
            {post.points}
            <IconButton
                aria-label="updoot post"
                colorScheme={post.voteStatus === -1 ? "red" : undefined}
                icon={<ChevronDownIcon boxSize="24px"/>}
                onClick={async () => {
                    if (post.voteStatus === -1){
                        return;
                    }
                    setLoadingState("downdoot-loading");
                    await vote ({ 
                        variables: {
                            postId: post.id,
                            value: 1
                        }
                    });
                    setLoadingState("not-loading");
                }}
                isLoading={loadingState === 'downdoot-loading'}
                />
        </Flex>
    )
}