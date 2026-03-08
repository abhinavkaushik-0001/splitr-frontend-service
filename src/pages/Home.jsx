import React, { useState } from 'react'
import { Button } from '@/components/ui/button';
import { Plus, Users, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GroupModel } from '@/component/GroupModel/GroupModel';
function Home() {
    const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
    let data,isLoading=false;

    //const { data, isLoading } = useConvexQuery(api.contacts.getAllContacts);

    // Check for the createGroup parameter when the component mounts
    // useEffect(() => {
    //     const createGroupParam = searchParams.get("createGroup");

    //     if (createGroupParam === "true") {
    //         // Open the modal
    //         setIsCreateGroupModalOpen(true);

    //         // Remove the parameter from the URL
    //         const url = new URL(window.location.href);
    //         url.searchParams.delete("createGroup");

    //         // Replace the current URL without the parameter
    //         router.replace(url.pathname + url.search);
    //     }
    // }, [searchParams, router]);

    if (isLoading) {
        return (
            <div className="container mx-auto py-12">
                <BarLoader width={"100%"} color="#36d7b7" />
            </div>
        );
    }

    const { users, groups } = data || { users: [], groups: [] };

    return (
        <div className="container mx-auto py-6">
            <div className="mx-1 flex flex-col flex-row items-center gap-4 justify-between mb-6">
                <h1 className="text-5xl gradient-title">Groups</h1>
                <Button className="text-md bg-green-600 hover:bg-green-700"  onClick={() => setIsCreateGroupModalOpen(true)}>                    
                    Create Group
                    <Plus className="mr-1 h-4 w-4" />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                        <Users className="mr-2 h-5 w-5" />
                        Groups
                    </h2>
                    {groups.length === 0 ? (
                        <Card>
                            <CardContent className="py-6 text-center text-muted-foreground">
                                No groups yet. Create a group to start tracking shared expenses.
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {groups.map((group) => (
                                <Link key={group.id} href={`/groups/${group.id}`}>
                                    <Card className="hover:bg-muted/30 transition-colors cursor-pointer">
                                        <CardContent className="py-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-primary/10 p-2 rounded-md">
                                                        <Users className="h-6 w-6 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{group.name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {group.memberCount} members
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <GroupModel
                isOpen={isCreateGroupModalOpen}
                onClose={() => setIsCreateGroupModalOpen(false)}
                onSuccess={(groupId) => {
                    //router.push(`/groups/${groupId}`);
                }}
            />
        </div>
    );
}

export default Home