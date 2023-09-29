import {
  Button,
  Input,
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  SelectItem,
  ModalFooter,
  useDisclosure,
  Select,
} from "@nextui-org/react";

import { link as linkStyles } from "@nextui-org/theme";

import NextLink from "next/link";
import clsx from "clsx";
import { getSession, signOut, useSession } from "next-auth/react";
import { FcPlus } from "react-icons/fc";
import { useState } from "react";
import { useRouter } from "next/router";
import getConfig from "next/config";

const readingStatuses = [
  { id: "to_read", name: "to_read" },
  { id: "reading", name: "reading" },
  { id: "read", name: "read" },
];

export const Navbar = () => {
  const { data: session, status } = useSession();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [readingStatus, setReadingStatus] = useState("");
  const router = useRouter();

  const { publicRuntimeConfig } = getConfig();
  const accessToken = session?.user?.accessToken;
  const onSave = () => {
    async function setBooks() {
      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_SERVICE_URL ||
            publicRuntimeConfig.NEXT_PUBLIC_SERVICE_URL
          }`,
          {
            method: "POST",
            body: JSON.stringify({
              title: name,
              author: author,
              status: readingStatus,
            }),
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.ok) {
          alert("Book updated successfully!");
          router.push("/");
        } else {
          alert(`Session expired. Something went wrong!`);
          signOut({ callbackUrl: "/" });
        }
      } catch (e) {
        alert(`Something went wrong!"`);
      } finally {
        onOpenChange();
      }
    }
    setBooks();
  };

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <p className="font-bold text-inherit">Reading List</p>
          </NextLink>
        </NavbarBrand>
        <div className="hidden lg:flex gap-4 justify-start ml-2">
          <NavbarItem key="/">
            <NextLink
              className={clsx(
                linkStyles({ color: "foreground" }),
                "data-[active=true]:text-primary data-[active=true]:font-medium"
              )}
              color="foreground"
              href="/"
            >
              Home
            </NextLink>
          </NavbarItem>
          <NavbarItem key="/profile">
            <NextLink
              className={clsx(
                linkStyles({ color: "foreground" }),
                "data-[active=true]:text-primary data-[active=true]:font-medium"
              )}
              color="foreground"
              href="/profile"
            >
              Profile
            </NextLink>
          </NavbarItem>
        </div>
      </NavbarContent>
      <NavbarContent>
        <div className="hidden lg:flex gap-4 justify-start ml-2">
          Signed in as: {session?.user.email}
        </div>
      </NavbarContent>
      <NavbarContent>
        {session?.user ? (
          <div className="hidden lg:flex gap-4 justify-start ml-2">
            <Button
              variant="ghost"
              color="danger"
              onPress={() => {
                signOut({ callbackUrl: "/" });
              }}
            >
              {" "}
              Logout
            </Button>
            <Button onPress={onOpen} color="secondary" variant="ghost">
              <FcPlus />
              Add Book
            </Button>

            <Modal
              backdrop="opaque"
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              radius="lg"
              classNames={{
                body: "py-6",
                backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
                base: "border-[#292f46] bg-[#19172c] light:bg-[#19172c] text-[#a8b0d3]",
                header: "border-b-[1px] border-[#292f46]",
                footer: "border-t-[1px] border-[#292f46]",
                closeButton: "hover:bg-white/5 active:bg-white/10",
              }}
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      Add Book
                    </ModalHeader>
                    <ModalBody>
                      <Input
                        type="text"
                        label="Title"
                        onChange={(e) => setName(e.target.value)}
                      />

                      <Input
                        type="text"
                        label="Author"
                        onChange={(e) => setAuthor(e.target.value)}
                      />

                      <Select
                        items={readingStatuses}
                        label="Reading Status"
                        placeholder="Select status"
                        className="max-w-xs"
                        onChange={(e) => setReadingStatus(e.target.value)}
                      >
                        {(stat) => (
                          <SelectItem key={stat.id}>{stat.name}</SelectItem>
                        )}
                      </Select>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="primary" variant="light" onPress={onClose}>
                        Close
                      </Button>
                      <Button
                        className="bg-[#6f4ef2] shadow-lg shadow-indigo-500/20"
                        onPress={onSave}
                      >
                        Save
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>
        ) : (
          <></>
        )}
      </NavbarContent>
    </NextUINavbar>
  );
};
export async function getServerSideProps(context: any) {
  return {
    props: {
      session: await getSession(context),
    },
  };
}
