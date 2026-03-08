import React, { useState, useEffect } from "react";

import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";
import { useDebounce } from "@/hooks/useDebounce";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;
const groupSchema = z.object({
  name: z.string().min(1, "Group name is required"),
  description: z.string().optional(),
});
let errors = {}
export function GroupModel({ isOpen, onClose, onSuccess }) {
  const [groupDetails, setGroupDetails] = useState({ name: '', description: '' })
  const [searchMember, setSearchMember] = useState('')
  const [members, setMembers] = useState([])
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isSearching, setIsSearching] = useState(false)
  const [errors, setErrors] = useState({});

  const [searchQuery, setSearchQuery] = useState("");
  const [commandOpen, setCommandOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchMember, 600);

  const handleChange = (e) => {
    const { id, value } = e.target
    setGroupDetails(prev => ({ ...prev, [id]: value }))
  }


  const addMember = (user) => {
    if (!selectedMembers.some((m) => m._id === user._id)) {
      setSelectedMembers([...selectedMembers, user]);
    }
    setCommandOpen(false);
    setMembers([])
    setSearchMember("")
  };

  const removeMember = (userId) => {
    setSelectedMembers(selectedMembers.filter((m) => m._id !== userId));
  };

  const handleSubmit = async (e) => {
    try {
      console.log("Handle Submit is Clicked")
      e.preventDefault();
      const result = groupSchema.safeParse(groupDetails);
      if (!result.success) {
        const formattedErrors = {};
        result.error.issues.forEach((issue) => {
          formattedErrors[issue.path[0]] = issue.message;
        });
        setErrors(formattedErrors);
      } else {
        setErrors({});
        axios.post(baseUrl + '/api/v1/group/create-group', { ...groupDetails, members: selectedMembers.map(d => d._id) }).then(response => {
          console.log(response)
          toast.success(response.data.message, {
            position: 'bottom-center',
            autoClose: 3000
          });

        })
      }
    }
    catch (e) {
      console.log(e)
    }

  };
  let searchResults = []
  const handleClose = () => {
    reset();
    setSelectedMembers([]);
    onClose();
  };


  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.length <= 2) {
      setMembers([])
    }
    else if (debouncedSearchTerm && debouncedSearchTerm.length > 2) {
      const controller = new AbortController();

      const fetchResults = async () => {
        setIsSearching(true);
        try {
          const response = await fetch(
            `http://localhost:8080/api/v1/user/get-members?userName=${debouncedSearchTerm}`,
            { signal: controller.signal }
          );
          const data = await response.json();
          setMembers(data.payload)
          // if (data) {
          //     setIsUnique(data.success);
          // }

        } catch (error) {
          console.error('Search failed:', error);
          setMembers([])
        } finally {
          setIsSearching(false);

        }
      };

      fetchResults();
      return () => controller.abort();
    }

  }, [debouncedSearchTerm]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Group Name</Label>
            <Input
              id="name"
              value={groupDetails.name}
              onChange={handleChange}
              placeholder="Enter group name"
              className="focus-visible:ring-green-200 focus-visible:border-green-200"

            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={groupDetails.description}
              onChange={handleChange}
              placeholder="Enter group description"
              className="focus-visible:ring-green-200 focus-visible:border-green-200"
            />
          </div>

          <div className="space-y-2">
            <Label>Members</Label>
            <div className="flex flex-wrap gap-2 mb-2">

              {/*currentUser && (
                <Badge variant="secondary" className="px-3 py-1">
                  <Avatar className="h-5 w-5 mr-2">
                    <AvatarImage src={currentUser.imageUrl} />
                    <AvatarFallback>
                      {currentUser.name?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <span>{currentUser.name} (You)</span>
                </Badge>
              )*/}

              {selectedMembers.map((member) => (
                <Badge
                  key={member.id}
                  variant="secondary"
                  className="px-3 py-1"
                >
                  <Avatar className="h-5 w-5 mr-2">
                    <AvatarImage src={member.imageUrl} />
                    <AvatarFallback>
                      {member.firstName?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <span>{member.firstName}</span>
                  <button
                    type="button"
                    onClick={() => removeMember(member._id)}
                    className="ml-2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}


              <Popover open={commandOpen} onOpenChange={setCommandOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1 text-xs"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    Add member
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="start" side="bottom">
                  <Command>
                    <CommandInput
                      placeholder="Search by username..."
                      value={searchMember}
                      onValueChange={setSearchMember}
                    />
                    <CommandList>
                      <CommandEmpty>
                        {searchMember.length < 2 ? (
                          <p className="py-3 px-4 text-sm text-center text-muted-foreground">
                            Type at least 2 characters to search
                          </p>
                        ) : isSearching ? (
                          <p className="py-3 px-4 text-sm text-center text-muted-foreground">
                            Searching...
                          </p>
                        ) : (
                          <p className="py-3 px-4 text-sm text-center text-muted-foreground">
                            No users found
                          </p>
                        )}
                      </CommandEmpty>
                      <CommandGroup heading="Users">
                        {members?.map((user) => (
                          <CommandItem
                            key={user._id}
                            value={user.firstName + user.email}
                            onSelect={() => addMember(user)}
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback>
                                  {user?.firstName?.charAt(0)?.toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="text-sm">{user.firstName}</span>
                                <span className="text-xs text-muted-foreground">{user.email}</span>
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            {selectedMembers.length === 0 && (
              <p className="text-sm text-amber-600">
                Add at least one other person to the group
              </p>
            )}
          </div>



          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={false}
            >
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
